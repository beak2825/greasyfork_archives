// ==UserScript==
// @name        Reactor moder+
// @description Добавляет панель с нужными тегами для модератора
// @author      Malec3228
// @version     0.1
// @icon        http://joyreactor.cc/favicon.ico
// @run-at      document-end
// joyreactor
// @match       *://joyreactor.cc/*
// @match       *://*.joyreactor.cc/*
// @match       *://reactor.cc/*
// @match       *://*.reactor.cc/*
// @match       *://joyreactor.com/*
// @match       *://*.joyreactor.com/*
// @namespace https://greasyfork.org/users/320021
// @downloadURL https://update.greasyfork.org/scripts/387809/Reactor%20moder%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/387809/Reactor%20moder%2B.meta.js
// ==/UserScript==

(function()
{
  var Tags = ["Комиксы", "гифки", "красивые картинки", "geek", "Anime", "Эротика",
  "котэ", "игры","anon", "личное"];

  var inputTag;
  var tagList = document.createElement('div');
  tagList.style.width = "200px";
  tagList.style.height = "auto";
  tagList.style.background = "#FFF";
  tagList.style.position = "fixed";
  tagList.style.left = "61px";
  tagList.style.top = "30%";
  tagList.style.padding = "5px";
  tagList.style.display = "none";
  tagList.style.borderStyle = "none";
  tagList.style.borderTopStyle = "solid";
  tagList.style.borderBottomStyle = "solid";
  tagList.style.borderColor = "#fdb201";
  tagList.style.borderWidth = "#2px";
  tagList.style.borderRadius = "5px";
  var ul = document.createElement('ul');

  var colortmp = "#FFF";

  for (var i = 0; i < Tags.length; i++)
  {
    var tagli = document.createElement('li');
    var tagspan = document.createElement('span');
    tagspan.style.cursor = "pointer";
    tagspan.style.borderRadius = "13px";
    tagspan.style.fontSize = "12px";
    tagspan.style.fontWeight = "bold";
    tagspan.style.lineHeight = "13px";
    tagspan.style.padding = "0 10px";
    tagspan.style.textDecoration = "none";
    tagspan.innerHTML = Tags[i];
    tagspan.addEventListener("click", function(e)
    {
      if (inputTag.val().toLowerCase().includes($(e.target).html().toLowerCase() + ", "))
      {
        inputTag.val(inputTag.val().replace($(e.target).html() + ", ",""));
        e.target.style.background = "#FFF";
        colortmp = "#FFF";
      }
      else
      {
        inputTag.val(inputTag.val() + $(e.target).html() + ", ");
        e.target.style.background = "#fdb201";
        colortmp = "#fdb201";
      }
    });
    tagspan.addEventListener("mouseover", function(e)
    {
      colortmp = e.target.style.backgroundColor;
      e.target.style.backgroundColor = "#EEE";
    });
    tagspan.addEventListener("mouseout", function(e)
    {
      e.target.style.backgroundColor = colortmp;
    });
    tagli.append(tagspan);
    ul.append(tagli);
  }

  tagList.append(ul);
  var container = document.getElementById("container");
  container.append(tagList);

  var x = document.getElementsByClassName("link setTagLink");
  for (var i = 0; i < x.length; i++)
  {
    x[i].addEventListener("click", function(e)
    {
      inputTag = $(e.target).parent().parent().parent().children().eq(1).children().first().children().first().children().first();

      setTimeout(function()
      {
        for (var j = 0; j < Tags.length; j++)
        {
          if (inputTag.val().includes(Tags[j] + ", "))
          {
            ul.children[j].children[0].style.backgroundColor = "#fdb201";
          }
        }
      },200);
      
      for (var i = 0; i < tagList.children[0].children.length; i++)
      {
        tagList.children[0].children[i].children[0].style.background = "#FFF";
      }

      tagList.style.display = "block";
    });
  }
})();