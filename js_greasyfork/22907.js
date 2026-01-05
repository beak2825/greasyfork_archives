// ==UserScript==
// @name     Core script for Toolbox
// @description:en   Menu/Page insert script
// @include  *
// @grant    GM_addStyle
// @version 0.0.1.20160904145923
// @namespace https://greasyfork.org/users/3920
// @description Menu/Page insert script
// @downloadURL https://update.greasyfork.org/scripts/22907/Core%20script%20for%20Toolbox.user.js
// @updateURL https://update.greasyfork.org/scripts/22907/Core%20script%20for%20Toolbox.meta.js
// ==/UserScript==

// width, height, class, title, link
var toollist = [
//  [350, 80, "calc", "Time Calc", "https://www.dropbox.com/s/7ma0vbax0fi0tt1/noframe_timecalc.html?raw=1"],
//  [700, 220, "regex", "Regex Replace", "https://www.dropbox.com/s/9nwmq7c41qje9af/noframe_regex.html?raw=1"],
  [350, 80, "calc", "Time Calc", "https://googledrive.com/host/0BzBa_Aba0i_2VGpCVnhQd3IxN28"],
  [700, 220, "regex", "Regex Replace", "https://googledrive.com/host/0BzBa_Aba0i_2eVVRc0hBNWlQTWM"],
];

var iwidth = 0;
var iheight = 1;
var iclass = 2;
var ititle = 3;
var ilink = 4;

var z = 1;

function ResizeFrame(frameObj) {
  // IFRAME 내부의 body 개체
  var fBody = frameObj.contentWindow.document.body;

  // IFRAME 내부의 body개체의 넓이를 계산하여 IFRAME의 넓이를 설정해 준다.
  frameObj.style.width = fBody.scrollWidth + (fBody.offsetWidth - fBody.clientWidth);
  // IFRAME 내부의 body개체의 높이를 계산하여 IFRAME의 높이를 설정해 준다.
  frameObj.style.height = fBody.scrollHeight + (fBody.offsetHeight - fBody.clientHeight);

  // 만약 IFRAME의 크기 설정에 실패 하였다면 기본크기로 설정한다.
  if (frameObj.style.height == "0px" || frameObj.style.width == "0px") {
    frameObj.style.width = "700px"; //기본 iframe 너비
    frameObj.style.height = "300px"; //기본 iframe 높이
  }
}

function InsertPage(select) {
  $.ajax({
    type: "GET",
    url: toollist[select][ilink],
    contentType: 'application/html',
    dataType: "html",
    success: function(html) {
      //      $("#" + toollist[select][iclass]).html(html);
      var regexp = /<body>((.|\r|\n)+?)<\/body>/;
      var results = regexp.exec(html);
      if (results !== null)
        $("#" + toollist[select][iclass]).html(results[1]);
      else
        $("#" + toollist[select][iclass]).html("error");
    },
    error: function(xhr, status, error) {
      $("#" + toollist[select][iclass]).html("error");
    }
  });
}

function reSortLayer(select) {
  var sorting = Array();
  for (var i = 0; i < toollist.length; ++i) {
    var layername = "#draggable" + toollist[i][iclass];
    var zindex = $(layername).css("z-index");
    if (isNaN(zindex))
      continue;
    sorting.push({
      name: layername,
      z: zindex
    });
  }

  sorting.sort(function(a, b) {
    return a.z < b.z ? -1 : a.z > b.z ? 1 : 0;
  });

  var zindex = 1;
  for (var i = 0; i < sorting.length; ++i) {
    if (select == sorting[i].name)
      $(select).css("z-index", sorting.length);
    else {
      $(sorting[i].name).css("z-index", zindex);
      ++zindex;
    }
  }
}

InsertFramePage = function(select) {
  if (document.getElementById(toollist[select][iclass]) !== null) {
    reSortLayer("#draggable" + toollist[select][iclass]);
    return;
  }
  //	var frame = document.createElement("iframe");
  var frame = document.createElement("div");
  frame.setAttribute("width", toollist[select][iwidth]);
  frame.setAttribute("height", toollist[select][iheight]);
  //	frame.setAttribute("src", toollist[select][ilink]);
  frame.setAttribute("id", toollist[select][iclass]);
  //	frame.setAttribute("onLoad", "ResizeFrame(this);");
  //  frame.setAttribute("frameborder", "0");
  //  frame.setAttribute("scrolling", "no");
  InsertPage(select);

  var y = Math.floor(Math.random() * 200) + 50;
  var x = Math.floor(Math.random() * 200) + 50;
  var layer = document.createElement("div");
  layer.setAttribute("id", "draggable" + toollist[select][iclass]);
  layer.setAttribute("class", "layer ui-widget-content");
  layer.innerHTML = toollist[select][ititle] + "<br />";
  layer.style.cssText = [
    'position:absolute;',
    'z-index:1;',
    'width:' + toollist[select][iwidth] + 'px;',
    'top:' + y + 'px;',
    'left:' + x + 'px;',
  ].join(' ');
  layer.appendChild(frame);
  document.getElementById("contents").appendChild(layer);

  $(".layer").draggable({
    opacity: 0.35,
    stack: ".layer",
    drag: function(event, ui) {
      // Keep the left edge of the element
      // at least 100 pixels from the container
      ui.position.left = Math.max(0, ui.position.left);
      ui.position.top = Math.max(0, ui.position.top);
    },
  });

  $("#draggable" + toollist[select][iclass]).css("z-index", z);
  ++z;
}

function InitMenubar() {
  var ulElem = document.createElement("ul");
  for (var i = 0; i < toollist.length; ++i) {
    var liElem = document.createElement("li");
    var selectElem = document.createElement("div");
    selectElem.setAttribute("class", "selectbutton");
    selectElem.setAttribute("id", "item");
    selectElem.setAttribute("onclick", "InsertFramePage(" + i + ");");
    selectElem.setAttribute("value", "r");
    selectElem.innerHTML = toollist[i][ititle];
    liElem.appendChild(selectElem);
    ulElem.appendChild(liElem);
  }
  return ulElem;
}

function InitPage() {
  var menubar = document.createElement("div");
  menubar.setAttribute("id", "menubar");
  menubar.setAttribute("class", "menubar");
  menubar.appendChild(InitMenubar());
  document.body.appendChild(menubar);

  var contents = document.createElement("div");
  contents.setAttribute("id", "contents");
  contents.style.cssText = [
    'width:100%;',
    'height:100%;',
    'display:inline-block;',
    'position: absolute;',
    'z-index: 0;',
    'top: 0px;',
    'left: 0px;',
  ].join(' ');
  document.body.appendChild(contents);
}

window.onload = function() {
  InitPage();
}
