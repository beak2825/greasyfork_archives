// ==UserScript==
// @name        DVDs Release Dates helper
// @namespace   V@no
// @description Add external links
// @include     http://www.dvdsreleasedates.com/*
// @include     https://www.dvdsreleasedates.com/*
// @license     MIT
// @version     1.3.3
// @grant       none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/35654/DVDs%20Release%20Dates%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/35654/DVDs%20Release%20Dates%20helper.meta.js
// ==/UserScript==
/*jshint esversion: 6*/

!function(self)
{
  let linksDefault = (() =>
  {
    const l = [
      {
        name: "Wikipedia",
        url: "https://wikipedia.org/wiki/TITLE",
      },
      {
        name: "ThePirateBay",
        url: "https://thepiratebay.org/search/TITLE/0/3/0",
      },
      {
        name: "IMDB",
        url: "http://www.imdb.com/title/IMDB/",
      },
      {
        name: "1337x",
        url: "https://1337x.to/sort-category-search/TITLE/Movies/time/desc/1/",
      },
      {
        name: "RARBG",
        url: "https://rarbg.to/torrents.php?search=TITLE&order=data&by=DESC",
      },
    ],
    r = {};
    for(let i = 0; i < l.length; i++)
    {
      r[getId(l[i].name)] = Object.assign({}, l[i]);
    }
    return r;
  })();

  let log = console.log.bind(console),
      version = 0;

  try
  {
    version = GMs_info.script.version;
  }
  catch(e)
  {
    try
    {
      let s = JSON.stringify(self.GM_info || self),
          chk = 0x12345678;

      for (let i = 0; i < s.length; i++)
      {
          chk += (s.charCodeAt(i) * (i + 1));
      }
      version = (chk & 0xffffffff).toString(16);
    }catch(e){}
  }

  function $(id)
  {
    return document.getElementById(id);
  }

  function urlencode(url)
  {
    return encodeURI(url).replace(/%5B/g, '[').replace(/%5D/g, ']');
  }

  function ls(id, data)
  {
    let r;
    if (typeof(data) == "undefined")
    {
      try
      {
        r = localStorage.getItem(id);
      }
      catch(e)
      {
        log(e);
        return r;
      }
      try
      {
        r = JSON.parse(r);
      }catch(e){}
    }
    else
    {
      try
      {
        r = localStorage.setItem(id, JSON.stringify(data));
      }
      catch(e)
      {
        log(e);
        return r;
      }
    }
    return r;
  }

  function cleanup(t)
  {
    t = t.replace(/[-:,]\s(season\s(\w+))$/i, season);
    t = t.replace(/(the complete)?\s(\w+)\s(season)$/i, season);
    t = t.replace(/\[[^\]]*\]/g, "");
    let l = ["4k", "ultra", "hd", "bd", "ultrahd", "edition"];
    for(let i = 0; i < l.length; i++)
    {
      t = t.replace(new RegExp("\\b" + l[i] + "\\b", "gi"), "");
    }
    return t;
  }

  function season(a, b, c, d)
  {
    let n = ["", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eight", "ninth", "tenth"],
        i = n.indexOf(c.toLowerCase());

    if (i == -1)
    {
      n = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
      i = n.indexOf(c.toLowerCase());

      if (i == -1)
        i = c.replace(/[a-zA-Z]+/g, "");
    }

    return " S" + i;
  }

  function getIcon(id)
  {
    const item = links[id] || id,
          dom = (item.url.match(/\/\/([^\/{}]+)/) || [])[1];

    return item.icon ? item.icon : "https://www.google.com/s2/favicons?domain=" + (dom || "");
  }

  function getId(name)
  {
    return name.replace(/^([^a-zA-Z])/, "_$1").replace(/[^a-zA-Z0-9_-]/g, a => "_u" + a.charCodeAt(0).toString(16));
  }

  function updateAllLinks(cells)
  {
    if (!cells)
      cells = document.querySelectorAll(".dvdcell");

    for(let i = 0; i < cells.length; i++)
    {
      updateLinks(cells[i]);
    }
  }

  function updateLinks(obj)
  {
    let title = "",
        a = obj.getElementsByTagName("a"),
        elImdb = obj.querySelector(".imdblink.left > a"),
        imdb = (elImdb && elImdb.href.match(/\/([^\/]+)\/$/)||[])[1];

    for(let t = 0; t < a.length; t++)
    {
      if (!a[t].children.length)
      {
        title = a[t].textContent;
        break;
      }
    }
    if (!title)
      return true;

    let div = obj.querySelector(".links") || document.createElement("div"),
        isNew = !div.classList.contains("links"),
        style = "",
        last = null;

    div.className = "links";

    for(let n = 1; n < linksSaved.length; n++)
    {
      let a = div.querySelectorAll("a")[n-1] || document.createElement("a"),
          item = linksSaved[n],
          id = getId(item.name),
          icoUrl = getIcon(id);

      if (!a.href)
        div.appendChild(a);

      a.href = item.url .replace(/TITLE_ORIG/g, urlencode(title))
                        .replace(/TITLE/g, urlencode(cleanup(title)))
                        .replace(/IMDB/g, urlencode(imdb));
      a.setAttribute("target", "_blank");
      a.title = item.name;
      a.className = id;
      style += `div.links > a.${id}{background-image: url("${icoUrl}");}`;
      a.classList.toggle("hidden", ~~item.hidden);
      if (!item.hidden)
        last = a;
    }
    if (last)
      last.classList.add("last");

    if (isNew)
      obj.appendChild(div);

    while(div.children.length > linksSaved.length -1)
    {
      div.removeChild(div.lastChild);
    }
    clearTimeout(updateLinks.styleTimer);
    updateLinks.styleTimer = setTimeout(e =>
    {
      elStyleIcons.innerHTML = style;
    });
    return div;
  }

  function saveLinks(data)
  {
    if (!data)
    {
      data = linksSaved;
    }
    const list = [data[0]];
    for(let i = 1; i < data.length; i++)
    {
      const id = getId(data[i].name);
      list[i] = Object.assign({}, data[i]);
      if (linksDefault[id])
      {
        if (list[i].url == linksDefault[id].url)
          delete list[i].url;

        if (list[i].icon == linksDefault[id].icon)
          delete list[i].icon;
      }
    }
    ls("links", list);
    return list;
  }

  let linksSaved = ls("links") || [1], //at index 0 stored custom id;
      links = {};

  //legacy storaged data
  if (!(linksSaved instanceof Array))
  {
    const array = [1];
    for(let i in linksSaved)
    {
      if (i == "id")
        linksSaved[0] = linksSaved[i];
      else
      {
        if (typeof linksSaved[i] == "object")
          array[array.length] = Object.assign({id: i}, linksSaved[i]);
      }
    }
    linksSaved = array;
  }
  if (linksSaved)
  {
    for(let i = 1; i < linksSaved.length; i++)
    {
      links[getId(linksSaved[i].name)] = linksSaved[i];
    }
  }
  for(let i in linksDefault)
  {
    if (!linksDefault[i].icon)
      linksDefault[i].icon = "";

    const id = getId(linksDefault[i].name);
    if (!links[id])
    {
      links[id] = Object.assign({}, linksDefault[i]);
      linksSaved[linksSaved.length] = links[id];
    }
    else
    {
      if (!links[id].url)
        links[id].url = linksDefault[id].url;

      if (!links[id].icon)
        links[id].icon = linksDefault[id].icon;
    }
  }
  linksSaved = linksSaved.filter((link, i) =>
  {
    if (!i)
      return true;

    const id = getId(link.name),
          ok = links[id] && links[id].url;
    if (!ok)
      delete links[id];

    return ok;
  });
  saveLinks();
  let td = document.getElementsByClassName("dvdcell"),
      elStyleIcons = document.createElement("style");

  document.head.appendChild(elStyleIcons);

  updateAllLinks(td);

  //create stylesheet. A little trick to have multiline text
  let	style = document.createElement("style"),
      css = `
div.links
{
  display: block;
  text-align: center;
}
div.links > a
{
  width: 16px;
  height: 16px;
  padding-right: 2px;
  padding-left: 2px;
  display: inline-block;
  background-repeat: no-repeat;
  background-position: center;
  vertical-align: middle;
}
div.links > a:not(.last)
{
  border-right: 1px dotted silver;
}

div.links > a.hidden
{
  display: none;
}

/* links manager */

#menu_bar
{
  z-index: 1;
}

#menu_bar > ul
{
}

.dropdownMenu
{
  user-select: none;
  min-width: 26em;
  max-width: 26em;
}

.dropdownMenu .dropdownBox
{
  overflow: hidden;
  margin-left: -1em;
}

.dropdownMenu > a > label
{
  cursor: pointer;
}

.dropdownMenu > a > label:after
{
  font-family: monospace;
  content: "▼";
  margin-left: 0.5em;
  font-size: 0.8em;
}
.dropdownMenu .dropdown
{
  margin: 0 0 -230% 0;
  overflow: hidden;
  color: #fff;
  background-color: #494949;
  transition: margin-bottom 0.1s ease-out;
}

.dropdownMenu > input[type="checkbox"]
{
  display: none;
}

.dropdownMenu > input[type="checkbox"]:checked ~ .dropdownBox
{
  position: relative;
 }

.dropdownMenu > input[type="checkbox"]:checked ~ * .dropdown
{
  margin-bottom: 0;
  margin-top: 0.5em;
}

.dropdownMenu > input[type="checkbox"]:checked ~ a > label:after
{
  content: "▲";
}


.dropdownMenu .list,
.dropdownMenu .list > li.drag
{
  background-color: #424242;
}
.dropdownMenu .list
{
  max-height: 50em;
  overflow: hidden auto;
  padding: 0;
  width: 100%;
  fill: #fff;
}

.dropdownMenu .list > li
{
  white-space: nowrap;
  line-height: 2em;
  border: 1px dotted transparent;
  border-left-width: 0;
  border-right-width: 0;
  margin: 0 !important;
  padding: 0;
  cursor: pointer;
  display: grid;
  justify-items: center;
  grid-template-columns: 1fr 1fr 100fr 1fr;
}
.dropdownMenu .list > li:hover
{
  background-color: #494949
}

.dropdownMenu .list > li > span:first-child
{
}
.dropdownMenu .list > li > span:last-child
{
}

.dropdownMenu .list > li > *
{
  align-self: center;
}

.dropdownMenu .list > li *
{
  vertical-align: middle;
}

.dropdownMenu .list > li > .nameBox
{
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.dropdownMenu .list > li .name
{
}

.dropdownMenu .list > li > .order
{
  width: 16px;
  font-size: 16px;
  padding: 0.2em 0.2em 0.2em 0.5em;
}

.dropdownMenu .list > li > .order
{
  cursor: grab;
}

.dropdownMenu .list > li > .hidden
{
  font-size: 1.5em;
  display: inline-block;
  margin-right: 0.3em;
}
.dropdownMenu .list > li > .hidden::before
{
  content: "☑";
}
.dropdownMenu .list > li.hidden > .hidden::before
{
  content: "☐";
}
.dropdownMenu .list > li.drag
{
  background-color: #525252
}

body.dragging,
body.dragging *
{
  cursor: grabbing !important;
}

.dropdownMenu .list img
{
  width: 1em;
  margin: auto;
}

.dropdownMenu .list .editBox
{
  float: right;
  width: 1em;
  padding: 3px;
  font-size: 1.5em;
  line-height: 0.9em;
}

.dropdownMenu .list > li.selected
{
  border-color: #fff;
}

.dropdownMenu .list li.default .name
{
  font-style: italic;
}
.dropdownMenu .list li.default:not(.canDel) .editBox > span
{
  pointer-events: none;
  cursor: default;
  opacity: 0.1;
}

.dropdownMenu form
{
  padding: 0.4em;
}

.dropdownMenu form > .table
{
  display: table;
  border-spacing: 0.4em;
  width: 100%;
  width: -webkit-fill-available;
}

.dropdownMenu form > .table > *
{
  display: table-row;
  margin: 0.1em;
}

.dropdownMenu form > .table > * > *
{
  display: table-cell;

}

.dropdownMenu form > .table > * > span:first-of-type
{
  width: 0;
}


.dropdownMenu form > .actionBox
{
}
.dropdownMenu form > iconBox
{

}

.dropdownMenu form .icon
{
  width: 1.5em;
  height: 1.5em;
  margin-left: 0.5em;
  vertical-align: bottom;
}

.dropdownMenu form select
{
  width: 1.5em;
}
.dropdownMenu form .icon img
{
  width: 100%;
}

.dropdownMenu form input[type="text"]
{
  width: 100%;
  width: -webkit-fill-available;
}

.dropdownMenu form .flex
{
  display: flex;
  align-items: center;

}


.dropdownMenu > input[type="checkbox"]:checked ~ .overlay
{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: transparent;
}
`;
  style.innerHTML = css;
  document.getElementsByTagName("head")[0].appendChild(style);

  function nodeIndex(node)
  {
    let i = 0;
    while( (node = node.previousSibling) != null ) i++;
    return i;
  }

  function LinksManager ()
  {
    const menu = document.createElement("li"),
          id = "linksManager" + (new Date()).getTime();
    menu.className = "dropdownMenu";
    menu.innerHTML = `
<input type="checkbox" id="${id}">
<a href="#linksManager"><label for="${id}">Links Manager</label></a>
<div class="overlay"></div>
<div class="dropdownBox">
  <div class="dropdown">
    <ul class="list"></ul>
    <form onsubmit="return false">
      <span class="table">
        <div class="nameBox"><span>Name:</span><input name="name" type="text"></div>
        <div class="urlBox"><span>URL:</span><span class="flex"><input name="url" type="text">
          <select>
            <option value="TITLE">Title</option>
            <option value="TITLE_ORIG">Title (orig)</option>
            <option value="IMDB">IMDB ID</option>
          </select>
        </span></div>
        <div class="iconBox"><span>Icon:</span><span class="flex"><input name="icon" type="text"><span class="icon"><img></span></span></div>
      </span>
      <div class="actionBox"><input type="submit" value="Add"> <input type="reset" value="Clear"></div>
    </form>
  </div>
</div>
`;
    const elList = menu.querySelector(".list"),
          elForm = menu.querySelector("form"),
          elName = elForm.elements.name,
          elUrl = elForm.elements.url,
          elIcon = elForm.elements.icon,
          elIconImg = menu.querySelector(".icon > img"),
          elSubmit = elForm.querySelector('input[type="submit"]'),
          elReset = elForm.querySelector('input[type="reset"]'),
          elMenu = menu.querySelector(`input#${id}`),
          elOverylay = menu.querySelector(".overlay"),
          elSelect = elForm.querySelector(".urlBox select");

    elOverylay.addEventListener("click", e =>
    {
      if (!elMenu.checked)
        return;

      elMenu.checked = false;
    });
    const onInput = e =>
          {
            if (e.target === elIcon || e.target === elUrl)
            {
              elIconImg.src = getIcon({url:elUrl.value.trim(), icon:elIcon.value.trim()});
            }
            updateButtons();
          },
          updateInput = (el, value) =>
          {
            el.value = value === undefined ? "" : value;
            el.dispatchEvent(new Event("input"));
          },
          updateList = id =>
          {
            if (!links[id])
              return null;

            const icon = links[id].icon,
                  name = links[id].name,
                  url = links[id].url,
                  elLink = elList.querySelector(`li[data-id="${id}"]`) || document.createElement("li"),
                  isNew = !elLink.dataset.id;

            if (isNew)
            {
              elLink.innerHTML = `
<span class="order" title="Order">☰</span>
<span class="hidden" title="Visible"></span>
<span class="nameBox">
  <img>
  <span class="name"></span>
</span>
<span class="editBox">
  <span class="del" title="${linksDefault[id] ? "Reset" : "Delete"}"><svg viewBox="0 0 24 24"><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"></path></svg></span>
</span>
`;


              elList.appendChild(elLink);
              const elLinkDel = elLink.querySelector(".del"),
                    elLinkName = elLink.querySelector(".nameBox"),
                    elLinkOrder = elLink.querySelector(".order"),
                    elLinkHidden = elLink.querySelector(".hidden");

              elLinkHidden.addEventListener("click", e =>
              {
                e.stopPropagation();
                if (e.isTrusted)
                {
                  links[id].hidden = !links[id].hidden;
                  if (!links[id].hidden)
                    delete links[id].hidden;

                  saveLinks();
                }

                elLink.classList.toggle("hidden", ~~links[id].hidden);
                updateAllLinks();

              });
              elLinkHidden.click();
              elLink.addEventListener("click", e =>
              {
                if (e.target.matches("span.order"))
                  return;

                if (elLinkEdit)
                  elLinkEdit.classList.remove("selected");

                elLinkEdit = elLink;
                elLink.classList.add("selected");
                elLink.setAttribute('tabindex', '-1');
                elLink.focus();
                elLink.removeAttribute('tabindex');
                if (e.isTrusted)
                {
                  updateInput(elName, links[id].name);
                  updateInput(elUrl, links[id].url);
                  updateInput(elIcon, links[id].icon);
                }
                updateButtons();
              });

              elLinkDel.addEventListener("click", e =>
              {
                e.stopPropagation();
                const index = linksSaved.indexOf(links[id]);
                if (index < 0)
                  return;

                if (linksDefault[id])
                {
                  links[id].name = linksDefault[id].name;
                  links[id].url = linksDefault[id].url;
                  links[id].icon = linksDefault[id].icon;
                }
                else
                {
                  delete links[id];
                  linksSaved.splice(index, 1);
                }
                saveLinks();
                updateAllLinks();
                const remove = [];
                for (let i = 0; i < elList.children.length; i++)
                {
                  if (!links[elList.children[i].dataset.id])
                  {
                    remove[remove.length] = elList.children[i];
                  }
                }
                for(let i = 0; i < remove.length; i++)
                {
                  if (remove[i] === elLinkEdit)
                    elLinkEdit = null;

                  elList.removeChild(remove[i]);
                }
                if (elLink === elLinkEdit)
                {
                  elLinkName.click();
                }
                updateList(id);
                updateButtons();
              });

              elLinkOrder.addEventListener("mousedown", e =>
              {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                elDrag = elLink;
                elDrag.classList.add("drag");
                document.body.classList.add("dragging");
                const onMouseUp = e =>
                      {
                        document.body.removeEventListener("mouseup", onMouseUp);
                        document.body.removeEventListener("mousemove", onMouseMove);
                        document.body.classList.remove("dragging");
                        elDrag.classList.remove("drag");
                        elDrag.style.top = "";
                        elDrag = null;
                        for(let i = 0; i < elList.childNodes.length; i++)
                        {
                          linksSaved[i+1] = links[elList.childNodes[i].dataset.id];
                        }
                        saveLinks();
                        updateAllLinks();
                      },
                      onMouseMove = e =>
                      {
                        const listRect = elList.getBoundingClientRect(),
                              firstRect = elList.firstChild.getBoundingClientRect(),
                              lastRect = elList.lastChild.getBoundingClientRect(),
                              index = nodeIndex(elDrag);
                        let node = null;
                        if (e.y < firstRect.bottom)
                        {
                          node = elList.firstChild;
                        }
                        else if (e.y > lastRect.top)
                        {
                          node = elList.lastChild;
                        }
                        else
                        {
                          node = document.elementFromPoint(listRect.left, e.y);
                          while(node.tagName != "LI" && (node = node.parentNode).tagName != "LI");
                        }
                        if (node && node !== elDrag)
                        {
                          if (node === elList.lastChild)
                            node.parentElement.appendChild(elDrag);
                          else
                          {
                            if (node.nextSibling && index < nodeIndex(node))
                              node = node.nextSibling;

                            node.parentNode.insertBefore(elDrag, node);
                          }
                        }
                      };//onMouseMove()
                document.body.addEventListener("mousemove", onMouseMove);
                document.body.addEventListener("mouseup", onMouseUp);
              }, false);
            }//if(isNew)
            if (linksDefault[id])
            {
              elLink.classList.add("default");
              elLink.classList.toggle("canDel", linksDefault[id].name != name || linksDefault[id].icon != icon || linksDefault[id].url != url);
            }
            elLink.querySelector(".name").textContent = links[id].name;
            elLink.querySelector(".nameBox > img").src = getIcon(id);
            elLink.title = links[id].name + "\n" + links[id].url;
            elLink.dataset.id = id;
            return elLink;
          },//updateList()
          updateButtons = () =>
          {

            const name = elName.value.trim(),
                  url = elUrl.value.trim(),
                  icon = elIcon.value.trim(),
                  id = getId(name);

            elLinkEdit && elLinkEdit.classList.remove("selected");
            if (links[id])
            {
              elLinkEdit = elList.querySelector(`li[data-id="${id}"]`);
              if (elLinkEdit)
              {
                // links[id] !== links[elLinkEdit.dataset.id];
                elLinkEdit.classList.add("selected");
                const focus = document.activeElement;
                elLinkEdit.setAttribute('tabindex', '-1');
                elLinkEdit.focus();
                elLinkEdit.removeAttribute('tabindex');
                focus.focus();
              }
            }
            const link = elLinkEdit && links[elLinkEdit.dataset.id] || {},
                  isUpdate = elLinkEdit && name == link.name;

            if (!isUpdate)
              elLinkEdit = null;
            elSubmit.value = isUpdate ? "Update" : "Add";
            elSubmit.disabled = name == "" || url == "" || (name == link.name && url == link.url && icon == link.icon);
            elReset.disabled = name == "" && url == "" && icon == "";
          };
    elSelect.value = "";
    elSelect.addEventListener("change", e =>
    {
			let start = elUrl.selectionStart,
					end = elUrl.selectionEnd,
					endNew = start + e.target.value.length,
					startNew = endNew,
					txt = elUrl.value;
      elUrl.value = txt.substring(0, start) + e.target.value + txt.substring(end);
      elUrl.selectionStart = startNew;
      elUrl.selectionEnd = endNew;
			elUrl.focus();
			elUrl.dispatchEvent(new Event("input"));
			e.target.value = "";
    });
    elName.addEventListener("input", onInput);
    elUrl.addEventListener("input", onInput);
    elIcon.addEventListener("input", onInput);
    let elLinkEdit = null,
        elDrag = null;

    elSubmit.addEventListener("click", e =>
    {
      const name = elName.value.trim(),
            url = elUrl.value.trim(),
            icon = elIcon.value.trim(),
            id = elLinkEdit && (elLinkEdit && links[elLinkEdit.dataset.id] || {}).name == name ? elLinkEdit.dataset.id : getId(name),
            link = links[id] || {};

      link.name = name;
      link.url = url;
      link.icon = icon;

      if (links[id])
        elLinkEdit.dataset.id = id;
      else
      {
        linksSaved[linksSaved.length] = link;
        links[id] = link;
      }
      elLinkEdit = updateList(id);
      updateButtons();
      updateAllLinks();
      saveLinks();
    });

    elReset.addEventListener("click", e =>
    {
      elUrl.value = "";
      elIcon.value = "";
      elName.value = "";
      elIconImg.removeAttribute("src");
      elLinkEdit.classList.remove("selected");
      elLinkEdit = null;
      updateButtons();
    });
    for(let i = 1; i < linksSaved.length; i++)
    {
      updateList(getId(linksSaved[i].name));
    }

    updateButtons();
    return {
      get dom() {return menu;},

    };
  }

  const linksManager = new LinksManager();
  document.querySelector("#menu_bar > ul").appendChild(linksManager.dom);


}(this);