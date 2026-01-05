// ==UserScript==
// @name           Improve logsoku  for smart phone
// @description    display image directly, add links that show a certain accout of floor
// @include        https://www.logsoku.com/*
// @include        https://sp.logsoku.com/*
// @include        http://*.2ch.*
// @author         yechenyin
// @version        0.92.4
// @namespace 	   https://greasyfork.org/scripts/3497
// @downloadURL https://update.greasyfork.org/scripts/3497/Improve%20logsoku%20%20for%20smart%20phone.user.js
// @updateURL https://update.greasyfork.org/scripts/3497/Improve%20logsoku%20%20for%20smart%20phone.meta.js
// ==/UserScript==


/**************************以下参数可自定义修改**************************/

//图片显示默认缩放比例
var percent = 0.5;

//图片显示最大高度(像素）
var image_max_height = 420;

//图片显示最大宽度(像素）
var image_max_width = 600;

//图片显示最小高度(像素）
var image_min_height = 240;

//显示显示最小宽度(像素）
var image_min_width = 320;

//弹出图片的原图，要取消此功能请将true改为false
var popup_enable = true;

//点击图片后隐藏图片，要取消此功能请将true改为false
var click_to_hide_image = true;


//
var phone_thread_comments = 334;

//
var contain_floores = 250;

//
var pc_searched_links_contain_comments = 500;

//
var latest_floors = 150;

var block_floors_contain_blacklist_image = true;

var search_result_latest_floors = 15;

/****************************************************/
if (!localStorage)
  alert('This browser does not support localStorage!');
if (localStorage.last_read === undefined)
  localStorage.last_read = '';
if (localStorage.filter === undefined)
  localStorage.filter = '';
if (localStorage.blacklist_ids === undefined)
  localStorage.blacklist_ids = '';
if (localStorage.blacklist_images === undefined)
  localStorage.blacklist_images = '';
window.onerror = function(msg, url, num) {
  //alert(num+' '+msg);
};

if (location.href.match("https://sp.logsoku.com/search")) {
  $('head').append($('<style>').text('iframe' + ' {display:none!important}'));
  for (var i = 0; i < $("a.search_thread_title").length; i++) {
    var thread = $("a.search_thread_title").eq(i);
    last_comment = thread.next().find(".res span").text().match(/\d+/)[0];
    var href = thread[0].href + "1-" + last_comment;
    var all_comments = $("<a>", {
      href: href
    });
    thread.next().find(".res span").wrap(all_comments);


    var time = thread.next().find(".date").text();
    time = time.replace(/\d{4}-/, "").replace(/:\d{2}\s/, " ");
    time = time.replace(/\d{4}-/, "").replace(/:\d{2}\s$/, " ");
    thread.next().find(".date").text(time);

  }


  get_last_read("a.search_thread_title");
// openDB().onsuccess  = function(event){
//   var db = event.target.result;
//   var transaction = db.transaction(["read"],"readwrite");
//   var store = transaction.objectStore("read");
//
//   for (var i=0; i<$("a.search_thread_title").length; i++) {
//     (function(i) {
//       var thread = $("a.search_thread_title").eq(i);
//       var url = thread[0].href.replace("https://sp.logsoku.com", "");
//       var request = store.get(url);
//       request.onsuccess = function(event){
//         if (event.target.result) {
//           var start = event.target.result.last + 1;
//           if (start >1000)
//           start = 1001;
//           var end = start + phone_thread_comments;
//           thread[0].href = url + start + "-" + end;
//         } else {
//           thread[0].href = url + "1-" + phone_thread_comments;
//         }
//         console.log(i + ":" + thread[0].href);
//       };
//     })(i);
//   }
// };
}



jQuery.fn.loaded = function(action) {
  var target = this;
  if ($(this.selector).length > 0) {
    console.log($(this.selector).length + ' ' + this.selector + " is loaded");
    setTimeout(function() {
      action();
    }, 300);
  } else
    setTimeout(function() {
      target.loaded(action);
    }, 100);
};

jQuery.fn.handle = function() {
  this.each(function() {
    if (this.href && this.href.indexOf("http://l.moapi.net/") === 0) {
      this.href = this.href.replace("http://l.moapi.net/", '');
      this.href = this.href.replace(/\w*:?\/\//, "http://");
    }
    if (this.href && this.offsetTop > document.body.scrollTop - window.screen.height / 2 && this.offsetTop < document.body.scrollTop + window.screen.height * 3) {
      if (localStorage.blacklist_images && localStorage.blacklist_images.indexOf(this.href) > 0) {
        if (block_floors_contain_blacklist_image) {
          $(this).parent().prev().hide();
          $(this).parent().hide();
        }
        else
          $(this).hide();
      } else if (this.href.match(/\.(jpg|jpeg|bmp|gif|png|JPG|JPEG|BMP|GIF|PNG)(:orig)?$/) && localStorage.filter != "all_comments_hide_images") {
        console.log(this.href);
        $(this).replaceWith($("<img>", {
          src: this.href
        }));
      }
    }
  });
};

if (location.href.indexOf("https://sp.logsoku.com/r/") === 0) {
  $('head').append($('<style>').text('iframe' + ' {display:none!important}'));

  if (location.href[location.href.lastIndexOf("/") + 1] != "l")
    var first = parseInt($(".thread_2ch>dd").eq(0).attr("id").replace("comment_", ""));
  else
    var first = parseInt($(".thread_2ch>dd").eq(1).attr("id").replace("comment_", ""));
  var last = parseInt($(".thread_2ch>dd").last().attr("id").replace("comment_", ""));
  if (last > 1000)
    last = 1001;
  var amount = parseInt($(".navbar").prev().text().match(/^\d+/)[0]);
  if (amount > 1000)
    amount = 1000;

  $(".pagination li").remove();
  var href = location.href.substring(0, location.href.lastIndexOf("/") + 1);

  var link = null;
  if (first - phone_thread_comments >= 1)
    link = $("<a>", {
      text: "<",
      href: href + (first - phone_thread_comments).toString() + "-" + (first - 1).toString()
    });
  else if (first >= 1)
    link = $("<a>", {
      text: "<",
      href: href + "1" + "-" + (first - 1).toString()
    });
  if (link)
    $(".pagination ul").append(link.wrap($("<li>")));

  for (var i = 0; i < amount / phone_thread_comments; i++) {
    link = $("<a>", {
      text: (i + 1).toString(),
      href: href + (i * phone_thread_comments + 1).toString() + "-" + (i * phone_thread_comments + phone_thread_comments).toString()
    });
    $(".pagination ul").append(link.wrap($("<li>")));
  }

  var next_link = null;
  if (last + phone_thread_comments < amount)
    next_link = $("<a>", {
      text: ">",
      href: href + (last + 1).toString() + "-" + (last + phone_thread_comments).toString()
    });
  else if (last + 1 <= amount)
    next_link = $("<a>", {
      text: ">",
      href: href + (last + 1).toString() + "-" + amount
    });
  if (next_link)
    $(".pagination ul").append(next_link.wrap($("<li>")));

  var filter_menu = $("<li>", {
    class: "dropdown open filter"
  });
  var innerHTML = "<a href='#' class='dropdown-toggle'>过滤<b class='caret'></b></a>";
  innerHTML += "<ul class='dropdown-menu filter-menu' style='display:none'>";
  innerHTML += "<li id='all_comments'><a>全部</a></li><li class='divider'></li>";
  innerHTML += "<li id='all_comments_hide_images'><a>不显示图片</a></li><li class='divider'></li>";
  innerHTML += "<li id='only_reply_and_links'><a>只含回复及链接</a></li><li class='divider'></li>";
  innerHTML += "<li id='only_links_and_images'><a>只含链接及图片</a></li><li class='divider'></li>";
  innerHTML += "<li id='only_images'><a>只含图片</a></li> </ul>";
  filter_menu.html(innerHTML);
  filter_menu.insertBefore($("ul.nav>li:last-child").eq(0));

  $("li.filter>a").click(function() {
    $(this).next().toggle();
  });

  filter_comments();
  $("ul.filter-menu").on("click", "li", function(filter) {
    localStorage.filter = this.id;
    filter_comments();
  });


  record_last_read();
  get_last_read("dd>a[href^='/']");




  $(".thread dt br").remove();
  $(".thread dt .nem, dt>b").remove();
  $(".thread dt").append($("<span>", {
    text: "block this ID",
    click: blockId
  }));
  $(".thread dt").append("&nbsp;&nbsp;");
  $(".thread dt").append($("<span>", {
    text: "block images blow",
    click: blockImages
  }));
  $(".thread dt").each(function() {
    var id = $(this).find("a[class^='id']").text();
    if (localStorage.blacklist_ids && localStorage.blacklist_ids.indexOf(id) > 0) {
      $(this).next().remove();
      $(this).remove();
    }
  });

  $(".thread dd>a").handle();
  $(window).scroll(function() {
    $(".thread dd>a").handle();
  });


  $(".anchor_res>a").click(function() {
    $(this).parent().load(this.href + " .thread_2ch>dd");
    return false;
  });



  $("#thread-recommend-list-display a").loaded(function() {
    var recommend = $("#thread-recommend-list-display");
    var title = $('h1.title').eq(0).text();
    if (title.indexOf('★') > 0)
      common = title.substring(0, title.indexOf('★'));
    else if (title.indexOf('☆') > 0)
      common = title.substring(0, title.indexOf('★'));
    else {
      var title1 = recommend.find("a").eq(0).text();
      var title2 = recommend.find("a").eq(1).text();
      for (i = 0; i < title1.length; i++)
        if (title2[i] != title1[i])
          break;
      common = title1.substring(0, i - 1);
    }
    console.log('query:' + common);

    recommend.prepend($("<div>", {
      css: {
        display: "none"
      }
    }));
    recommend.children().first().load("https://sp.logsoku.com/search?q=" + common + " .search-list", function() {
      for (i = 0; i < recommend.find("li a").length; i++) {
        recommend.find("li a")[i].href = $(".search-list .column>a")[i].href;
        recommend.find("li a")[i].textContent = $(".search-list .column>a")[i].textContent;
      }

      recommend.find("li").each(function() {
        if (location.href.match($(this).find("a")[0].href)) {
          $(this).css({
            'border': '2px solid #AFAE93',
            'border-top': '1px solid #AFAE93'
          });
        }
      });

      get_last_read("#thread-recommend-list-display a");
      recommend.find("li a").each(function() {
        if (this.href.match(/\d+(?=-)/)[0] > 1000) {
          $(this).css({
            'color': '#8F8E7D'
          });
        }
      });

    });
  });

}



function get_last_read(links) {
  for (var i = 0; i < $(links).length; i++) {
    var thread = $(links)[i];
    var url = thread.href.replace("https://sp.logsoku.com", "");
    var index = -1;
    if (localStorage.last_read)
      index = localStorage.last_read.indexOf(url);
    if (index > 0) {
      var last_read = parseInt(localStorage.last_read.substr(index - 3, 3));
      if (last_read === 0)
        last_read = 1000;
      var start = last_read + 1;
      var end = start + phone_thread_comments;
      console.log(last_read + ' is read last time for ' + url);

      thread.href = url + start + "-" + end;
    } else {
      thread.href = url + "1-" + phone_thread_comments;
    }
    console.log(i + "::" + thread.href);
  }
}


function record_last_read() {
  var url = location.href.replace("https://sp.logsoku.com", "");
  url = url.substring(0, url.lastIndexOf("/") + 1);
  var last_read = $(".thread_2ch>dt strong").last().text();
  if (last_read.length == 1)
    last_read = '00' + last_read;
  if (last_read.length == 2)
    last_read = '0' + last_read;
  if (last_read.length == 4)
    last_read = '000';
  console.log(last_read + ' is read for' + url);

  var index = -1;
  if (localStorage.last_read)
    index = localStorage.last_read.indexOf(url);
  if (index < 0) {
    localStorage.last_read += last_read + url + "\n";
  } else {
    localStorage.last_read = localStorage.last_read.substring(0, index - 4) + last_read + localStorage.last_read.substr(index);
  }
  console.log('last read:' + localStorage.last_read);

//   openDB().onsuccess  = function(event){
//     var db = event.target.result;
//     var transaction = db.transaction(["read"],"readwrite");
//     transaction.oncomplete = function(event) {
//       console.log("Success");
//     };
//     transaction.onerror = function(event) {
//       alert("Error");
//     };
//
//
//
//     var store = transaction.objectStore("read");
//     var request = store.get(url);
//     request.onsuccess = function(event){
//       if (!request.result) {
//         console.log("Adding : "+ url + " : " + last_read);
//         store.add({url: url, last: parseInt(last_read)});
//       } else {
//         console.log("Updating : "+event.target.result.last + " to " + last_read);
//         request.result.last = parseInt(last_read);
//         store.put(request.result);
//       }
//     };
//
//   };
//
}

function openDB() {
  var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  if (!indexedDB)
    console.log("你的浏览器不支持IndexedDB");

  var request = indexedDB.open("2chDB", 1);
  var db;
  request.onerror = function(event) {
    alert("打开DB失败" + event);
  };
  request.onupgradeneeded = function(event) {
    console.log("Upgrading");
    db = event.target.result;
    var objectStore = db.createObjectStore("read", {
      keyPath: "url"
    });
    objectStore.createIndex("last", "last", {
      unique: false
    });
  };
  return request;
}

function blockId() {
  var id = $(this).parent().find("a[class^='id']").text();
  localStorage.blacklist_ids += id + ",";

  $("dt").each(function() {
    var id = $(this).find("a[class^='id']").text();
    if (localStorage.blacklist_ids.indexOf(id) > 0) {
      $(this).next().hide();
      $(this).hide();
    }
  });
}

function blockImages() {
  var images = $(this).parent().next().find("img");
  localStorage.blacklist_images += images[0].src + " ";

  $("dt").each(function() {
    var images = $(this).next().find("img");
    for (i = 0; i < images.length; i++) {
      if (localStorage.blacklist_images.indexOf(images[i].src) > 0) {

        if (block_floors_contain_blacklist_image) {
          $(this).next().hide();
          //$(this).hide();
          break;
        } else
          $(images[i]).hide();
      }
    }
  });
}

function filter_comments() {
  if (this.nodeName == "li" && this.id !== undefined)
    localStorage.filter = this.id;

  $("ul.filter-menu>li").each(function() {
    if (this.id == localStorage.filter)
      $(this).css("background", "#d8edff");
    else
      $(this).css("background", "#fff");
  });
  $("ul.filter-menu").hide();

  if (localStorage.filter == "all_comments") {
    $("dd[id^=comment]").each(function() {
      $(this).prev().show();
      $(this).show();
    });
  } else if (localStorage.filter == "only_reply_and_links") {
    $("dd[id^=comment]").each(function() {
      if ($(this).find("a, img").length === 0) {
        $(this).prev().hide();
        $(this).hide();
      } else {
        $(this).prev().show();
        $(this).show();
      }
    });
  } else if (localStorage.filter == "only_links_and_images") {
    $("dd[id^=comment]").each(function(index) {
      if ($(this).find("a[href^='http:'], img").length === 0 && index !== 0) {
        $(this).prev().hide();
        $(this).hide();
      } else {
        $(this).prev().show();
        $(this).show();
      }
    });

  } else if (localStorage.filter == "only_images") {
    $("dd[id^=comment]").each(function() {
      if ($(this).find("img").length === 0) {
        $(this).prev().hide();
        $(this).hide();
      } else {
        $(this).prev().show();
        $(this).show();
      }
    });
  }

}

function pc_filter_comments() {
  if (this.nodeName !== undefined && this.id !== undefined)
    localStorage.filter = this.id;

  $("ul.filter-menu>li").each(function() {
    if (this.id == localStorage.filter)
      this.css("background", "#d8edff");
    else
      this.css("background", "#fff");
  });
  $("ul.filter-menu").hide();

  if (localStorage.filter == "all_comments") {
    $("dd[id^=comment]").each(function() {
      $(this).prev().show();
      $(this).show();
    });
  } else if (localStorage.filter == "only_reply_and_links") {
    $("dd[id^=comment]").each(function() {
      if ($(this).find("a, img").length === 0) {
        $(this).prev().hide();
        $(this).hide();
      } else {
        $(this).prev().show();
        $(this).show();
      }
    });
  } else if (localStorage.filter == "only_links_and_images") {
    $("dd[id^=comment]").each(function() {
      if ($(this).find("a[href^='http:'], img").length === 0) {
        $(this).prev().hide();
        $(this).hide();
      } else {
        $(this).prev().show();
        $(this).show();
      }
    });

  } else if (localStorage.filter == "only_images") {
    $("dd[id^=comment]").each(function() {
      if ($(this).find("img").length === 0) {
        $(this).prev().hide();
        $(this).hide();
      } else {
        $(this).prev().show();
        $(this).show();
      }
    });
  }

}

if (location.href.match("https://www.logsoku.com/search")) {
  var results = document.getElementById("search_result_threads");
  if (results) {
    var titles = results.getElementsByClassName("title");

    for (i = 0; i < titles.length; i++) {
      var link = titles[i].children[0];
      if (link)
        link.href = link.href + "l" + search_result_latest_floors;
    }
  }
}


if (location.href.match("https://www.logsoku.com/r/")) {
  $("div.comment").each(function() {
    if ($(this).find("a[href^='http://l.moapi.net/'], img").length === 0)
      $(this).parent().hide();
    else
      $(this).parent().show();
  });

  var links = document.links;
  for (j = 0; j < links.length; j++) {
    links[j].href = links[j].href.replace("http://l.moapi.net/", "");

    if (links[j].innerHTML.match(/.\.(jpg|jpeg|gif|png|JPG|JPEG|GIF|PNG)(:orig)?$/)) {
      var img = document.createElement("img");
      if (links[j].innerHTML.match(/\w*:?\/\//))
        img.src = links[j].innerHTML.replace(/\w*:?\/\//, "http://");
      else
        img.src = "http://" + links[j].innerHTML;

      img.style.display = "none";
      img.onload = resize;
      if (click_to_hide_image)
        img.onclick = function() {
          this.style.display = "none";
        };
      if (popup_enable) {
        var container = document.createElement("div");
        container.style.display = "inline";
        container.onmouseover = function() {
          this.children[0].style.display = "inline";
        };
        container.onmouseout = function() {
          this.children[0].style.display = "none";
        };
        container.appendChild(img);
      }
      links[j].parentNode.replaceChild(container, links[j]);
      j--;
    }

  }
  //pc_filter_comments();


  //    var filter_menu = $("<li>", {class:"dropdown open filter"});
  //    var innerHTML = "<a href='#' class='dropdown-toggle'>过滤<b class='caret'></b></a>";
  //    innerHTML += "<ul class='dropdown-menu filter-menu' style='display:none'>";
  //    innerHTML += "<li id='all_comments'><a>全部</a></li><li class='divider'></li>";
  //    innerHTML += "<li id='all_comments_hide_images'><a>不显示图片</a></li><li class='divider'></li>";
  //    innerHTML += "<li id='only_reply_and_links'><a>只含回复及链接</a></li><li class='divider'></li>";
  //    innerHTML += "<li id='only_links_and_images'><a>只含链接及图片</a></li><li class='divider'></li>";
  //    innerHTML += "<li id='only_images'><a>只含图片</a></li> </ul>";
  //    filter_menu.html(innerHTML);
  //    filter_menu.insertBefore($("ul.nav>li:last-child"));
  //    var filter_clicked = function (filter) {
  //	localStorage.filter = filter;
  //	filter_comments();
  //    }
  //
  //    $("li.filter>a").click(function() {
  //	$(this).next().toggle();
  //    });
  //
  //
  //    $("ul.filter-menu").on("click", "li", filter_comments);

  $(".thread-nav>div").append($("<div>", {
    class: "icheckbox_line-grey",
    text: "只打开图片",
    click: openImages,
    style: "width:120px"
  }));
  var nav = document.getElementsByClassName("thread-nav")[0].children[0];
  if (nav) {
    var base = nav.children[2].href;
    nav.children[3].href = base + "l" + latest_floors;

    for (i = 0; i < 1000 / contain_floores; i++) {
      var link = document.createElement("a");
      var range = String(i * contain_floores + 1) + "-" + String((i + 1) * contain_floores);
      link.href = base + range;
      link.innerHTML = range;
      link.className = "nav-btn";
      nav.appendChild(link);
    }
  }




  var hide_name = true;
  if (hide_name) {
    var names = document.querySelectorAll("span.nem, span.em");
    for (i = 0; i < names.length; i++) {
      names[i].style.display = "none";
      names[i].nextSibling.replaceData(0, 3, "");
      colon_pos = names[i].previousSibling.text.indexOf(":");
      names[i].previousSibling.replaceData(colon_pos + 1, 1, "");
    }
  }

  var comments = document.getElementsByClassName("comment");
  for (i = 0; i < comments.length; i++) {
    var id = comments[i].previousSibling.previousSibling.text;
    if (localStorage.blacklist_ids.indexOf(id) >= 0) {
      comments[i].parentNode.style.display = "none";
    }
    console.log(localStorage.blacklist_ids);


    var hide_id = document.createElement("span");
    hide_id.innerHTML = "&nbsp;(block this ID'comemnts)";
    hide_id.style.color = "#666";
    hide_id.style.cursor = "pointer";
    hide_id.onclick = function() {
      localStorage.blacklist_ids += id + " ";
      this.parentNode.style.display = "none";
    };
    comments[i].parentNode.insertBefore(hide_id, comments[i]);
  }


  var search_box = document.getElementsByClassName("top-search-box").parentNode;
  var black_list = document.createElement("li");
  var black_list_link = document.createElement("a");
  black_list_link.onclick = function() {
    this.previousSibling.style.display = "inline";
  };
  var black_list_text = document.createElement("span");
  black_list_text.innerHTML = "black list";
  black_list_link.appendChild(black_list_text);
  search_box.appendChild(black_list_link);


  // draw black list configuration board
  var black_list_configuration = document.createElement("div");
  black_list_configuration.style.textAlign = "center";
  var close = document.createElement("a");
  close.innerHTML = "&#10006;&times;";
  close.style.cssText = "float:right; padding:3px; border:1px #666 solid";
  close.onclick = function() {
    this.parentNode.style.display = "inline";
  };
  black_list_configuration.appendChild(close);

  var text = document.createElement("span");
  text.innerHTML = "IDs in the black list(seperate by space):";
  black_list_configuration.appendChild(text);
  var textarea = document.createElement("textarea");
  textarea.innerHTML = localStorage.blacklist_ids;
  textarea.id = "blacklist_ids";
  black_list_configuration.appendChild(textarea);

  var text = document.createElement("span");
  text.innerHTML = "Contents in the black list(seperate by new line):";
  black_list_configuration.appendChild(text);
  var textarea = document.createElement("textarea");
  textarea.innerHTML = localStorage.blacklist_contents;
  textarea.id = "blacklist_contents";
  black_list_configuration.appendChild(textarea);

  var close = document.createElement("a");
  close.innerHTML = "save";
  close.style.cssText = "padding:3px; border:1px #666 solid";
  close.onclick = function() {
    var input = document.getElementById("blacklist_ids");
    localStorage.blacklist_ids = input.nodeValue;
    input = document.getElementById("blacklist_contents");
    localStorage.blacklist_contents = input.nodeValue;
    this.parentNode.style.display = "none";
  };
  black_list_configuration.appendChild(close);

}

function resize() {
  var w = this.naturalWidth;
  var h = this.naturalHeight;
  var width = this.naturalWidth * percent;
  var height = this.naturalHeight * percent;

  height = height > image_max_height ? image_max_height : height;
  height = height < image_min_height ? image_min_height : height;
  width = height * w / h;


  width = width > image_max_width ? image_max_width : width;
  width = width < image_min_width ? image_min_width : width;
  height = width * h / w;

  height = height > image_max_height ? image_max_height : height;
  height = height < image_min_height ? image_min_height : height;
  width = height * w / h;

  this.width = width;
  this.height = height;
  this.style.display = "block";


  //insert popup image
  if (popup_enable) {
    var popup_img = document.createElement("img");
    width = w;
    height = h;
    var clientWidth = document.body.clientWidth;
    var clientHeight = document.body.clientHeight;


    if (height > clientHeight) {
      heigth = clientHeight;
      width = clientHeight * w / h;
    }
    if (width > clientWidth) {
      width = clientWidth;
      height = clientWidth * h / w;

      if (height > clientHeight) {
        heigth = clientHeight;
        width = clientHeight * w / h;
      }
    }
    popup_img.heigth = height;
    popup_img.width = width;

    popup_img.src = this.src;
    popup_img.style.zIndex = 2;
    popup_img.style.position = "fixed";
    popup_img.style.left = "0px";
    popup_img.style.top = "0px";
    popup_img.style.display = "none";
    //popup_img.onmouseout = function() { this.style.display = "none"};
    //var download = document.createElement("a");
    //download.setAttribute("download", "");
    //download.appendChild(popup_img);
    this.parentNode.insertBefore(popup_img, this);
    this.parentNode.heigth = height;
    this.parentNode.width = width;
  }

}



function openImages() {
  var images = "";
  for (var i = 0; i < $(".comment img").length; i++) {
    images += "<img  style='width:inherit'  src='" + $(".comment img")[i].src + "'><br>";
  }
  var images_window = window.open("", "images", "width=240, height=100");
  var message = "<div unselectable='on' style='user-select:none' selectstart='return false;'>Please press Ctrl+A.<br>Then Press Ctrl+C.<br>Because browser not allow script to copy images to clipboard. </div>";
  images_window.document.write(images);
}

jQuery.fn.disableSelection = function() {
  return this.attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);
};

//@ sourceURL=2ch.js
