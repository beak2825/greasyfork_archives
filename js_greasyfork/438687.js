// ==UserScript==
// @name        [PTP] - Bookmarks Extended
// @namespace   kannibalox
// @match       https://passthepopcorn.me/*
// @grant GM_setValue
// @grant GM_getValue
// @require https://greasyfork.org/scripts/5279-greasemonkey-supervalues/code/GreaseMonkey_SuperValues.js
// @version     1.2
// @author      kannibalox
// @license MIT
// @description Extend bookmarks with notes and categories
// @downloadURL https://update.greasyfork.org/scripts/438687/%5BPTP%5D%20-%20Bookmarks%20Extended.user.js
// @updateURL https://update.greasyfork.org/scripts/438687/%5BPTP%5D%20-%20Bookmarks%20Extended.meta.js
// ==/UserScript==
'use strict';
function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function createElement(str, raw = false) {
    var tmp = document.implementation.createHTMLDocument("");
    tmp.body.innerHTML = str;
    if (raw) {
        return tmp.body.children;
    } else {
        return tmp.body.children[0];
    }
};

function insertSidebarLink(text, fn) {
    var el = createElement('<li><a href="javascript:void(0);">['+text+']</a></li>');
    var parent = document.querySelectorAll('div.sidebar ul.list')[0];
    parent.appendChild(el);
    el.addEventListener('click', fn);
}

function loadCategories() {
    var cats = GM_SuperValue.get("categories");
    if (cats === undefined) {
        cats = [];
        GM_SuperValue.set("categories", cats);
    }
    var movies = GM_SuperValue.get("movies");
    if (movies === undefined) {
        movies = {};
        GM_SuperValue.set("movies", movies);
    }
}

function saveCategories(event) {
    var cats = GM_SuperValue.get("categories");
    var movies = GM_SuperValue.get("movies");
    var prompted = false;
    Array.prototype.forEach.call(document.querySelectorAll('input.category'), function(el, i) {
        if (el.value == "") {
            return
        } else if (el.className.includes("new")) {
            cats.push(el.value);
        } else if (el.className.includes("deleted")) {
            if (prompted == false) {
                var response = confirm("Are you sure you want to delete categories?");
                if (response == false) {
                    location.reload();
                } else {
                    prompted = true
                }
            }
            cats = cats.filter(function(e) { return e !== el.value });
        } else if (el.value != el.placeholder) {
            for (var m in movies) {
                if (movies[m]['category'] == el.placeholder) {
                    movies[m]['category'] = el.value
                }
                cats = cats.filter(function(e) { return e !== el.placeholder });
                cats.push(el.value);
            }
        }
    });
    GM_SuperValue.set("categories", cats.filter((v, i, a) => a.indexOf(v) === i));
    GM_SuperValue.set("movies", movies);
    location.reload();
}

function editCategories(event) {
    if (document.querySelectorAll('div#category-edit').length != 0) {
        return;
    }
    var parent = document.querySelectorAll('div.sidebar ul.list')[0];
    var container = createElement('<div id="category-edit"></div>');
    container.appendChild(createElement("<li>Rename/delete:</li>"));
    var cats = GM_SuperValue.get("categories");
    Array.prototype.forEach.call(cats, function(c, i) {
        var cat = createElement('<li><input type="text" class="category" name="category" placeholder="'+c+'" class="form__input" value="'+c+'"></li>');
        var cat_delete = createElement('<a>x</a>');
        cat_delete.addEventListener('click', function() {
            this.parentNode.firstChild.className = 'category deleted';
            this.parentNode.firstChild.style.display = "none";
            this.style.display = "none";
        });
        cat.appendChild(cat_delete);
        container.appendChild(cat);
    });
    container.appendChild(createElement("<li>Add new:</li>"));
    var newInput = createElement('<li><input type="text" class="category new" name="category" placeholder="Name" class="form__input" value=""> +</li>');
    container.appendChild(newInput);
    var save = createElement('<input type="button" value="Save">');
    save.addEventListener('click', saveCategories);
    var cancel = createElement('<input type="button" value="Cancel">');
    cancel.addEventListener('click', function(e) {
        container.parentNode.removeChild(container);
    });
    container.appendChild(save);
    container.appendChild(cancel);
    parent.appendChild(container);
    event.stopPropagation();
}

function saveMovie(event) {
    var movies = GM_SuperValue.get("movies");
    var movie_id = this.parentNode.parentNode.parentNode.firstChild.firstChild.href.split('=')[1];
    var cat = this.parentNode.parentNode.children[3].children[2].value;
    var notes = this.parentNode.parentNode.children[3].children[3].firstChild.value;
    var successColor = "#20b83e";
    var successIcon = "☑";
    movies[movie_id] = {
        'notes': notes,
        'category': cat
    }
    GM_SuperValue.set("movies", movies);
    var success = createElement('<span style="color: '+successColor+';">'+successIcon+'</span>');
    this.appendChild(success)
    setTimeout(function(){
         success.parentNode.removeChild(success)
    }, 1000);
}

function displayBookmarkInfo() {
    var movies = GM_SuperValue.get("movies");
    var cats = GM_SuperValue.get("categories");
    Array.prototype.forEach.call(document.querySelectorAll('table.torrent_table div.basic-torrent-list__movie__additional-info, div.js-huge_view_container div.huge-movie-list__movie__additional-info'), function(el, i) {
        var movie_id = el.parentNode.firstChild.firstChild.href.split('=')[1];
        var notes = ''
        var cat = 'Uncategorized'
        if (movie_id in movies) {
            notes = movies[movie_id]['notes'];
            cat = movies[movie_id]['category'];
        }
        var manager = createElement('<div><a href="javascript:void(0);">Save bookmark</a></div>');
        manager.addEventListener('click', saveMovie);
        el.appendChild(manager);
        var select = createElement('<select class="form__input" style="width: auto;"><option value="">Uncategorized</option></select>')
        for (i in cats) {
            var c = cats[i];
            var option = createElement('<option value="'+c+'">'+c+'</option>');
            if (c == cat) {
                option.selected = "selected";
            }
            select.appendChild(option);
        }
        el.appendChild(select);
        el.appendChild(createElement('<div><textarea placeholder="Notes">'+notes+'</textarea><br/></div>'));
    });
}

function showFormFilter() {
    var footer = document.querySelectorAll('span.search-form__footer__buttons')[0]
    var movies = GM_SuperValue.get("movies");
    var cats = GM_SuperValue.get("categories");
    var select = createElement('<select class="form__input" style="width: auto;"><option>All categories</option><option value="">Uncategorized</option></select>')
    for (var i in cats) {
        var c = cats[i];
        var option = createElement('<option value="'+c+'">'+c+'</option>');
        if (c == i) {
            option.selected = "selected";
        }
        select.appendChild(option);
    }
    select.addEventListener('change', function(event) {
        var value = this.selectedOptions[0].value;
        Array.prototype.forEach.call(document.querySelectorAll('table.torrent_table div.basic-torrent-list__movie__additional-info, div.js-huge_view_container div.huge-movie-list__movie__additional-info'), function(el, i) {
            var movie_id = el.parentNode.firstChild.firstChild.href.split('=')[1];
            var parent = el.parentNode.parentNode
            var display = 'none';
            if ((movie_id in movies && movies[movie_id]['category'] == value) || value == "All categories" || (!(movie_id in movies) && '' == value)) {
                display = 'table-row';
            }
            var next = parent.nextElementSibling;
            while (next !== null && !next.matches('.group')) {
                next.style.display = display;
                next = next.nextElementSibling;
            }
            parent.style.display = display;
        });
    });
    footer.insertBefore(select, footer.firstChild)
}

function addTorrentSearchPage() {
  var cats = GM_SuperValue.get("categories");
  var movies = GM_SuperValue.get("movies");
  Array.prototype.forEach.call(document.querySelectorAll('span.basic-movie-list__movie__bookmark'), function(el, i) {
    var movie_id = el.parentNode.children[0].children[0].href.replace(/.*id=([0-9]+)/, '$1');
    var notes = '';
    var cat = 'Uncategorized';
    var div = createElement('<div class="extended_bookmarks_pane"></div>');

    if (el.textContent != "Remove bookmark") {
      div.style.display="none";
    }
    if (movie_id in movies) {
      notes = movies[movie_id]['notes'];
      cat = movies[movie_id]['category'];
    }
    var select = createElement('<select class="form__input" style="width: auto;"><option value="">Uncategorized</option></select>')
    for (var i in cats) {
      var c = cats[i];
      var option = createElement('<option value="'+c+'">'+c+'</option>');
      if (c == cat) {
        option.selected = "selected";
      }
      select.appendChild(option);
    }
    var save = createElement('<a href="javascript:;"> [Save]</a>');
    save.addEventListener('click', saveTorrentSearchPage);
    div.append(save);
    div.append(select);
    div.append(createElement('<div><textarea placeholder="Notes">'+notes+'</textarea><br/></div>'));
    el.appendChild(div);
    el.children[0].addEventListener('click', setTorrentSearchPageVisiblity);
  });
}

function setTorrentSearchPageVisiblity() {
  if (this.textContent == "Remove bookmark") {
    this.parentNode.children[1].style.display = "none";
  } else {
    this.parentNode.children[1].style.display = null;
  }
}

function saveTorrentSearchPage(event) {
    var movies = GM_SuperValue.get("movies");
    var movie_id = this.parentNode.parentNode.parentNode.children[0].children[0].href.replace(/.*id=([0-9]+)/, '$1');
    var cat = this.parentNode.children[1].value;
    var notes = this.parentNode.children[2].children[0].value;
    var successColor = "#20b83e";
    var successIcon = "☑";
    movies[movie_id] = {
        'notes': notes,
        'category': cat
    }
    GM_SuperValue.set("movies", movies);
    var success = createElement('<span style="color: '+successColor+';">'+successIcon+'</span>');
    this.appendChild(success)
    setTimeout(function(){
         success.parentNode.removeChild(success)
    }, 1000);
}

function addTorrentPage() {
  var cats = GM_SuperValue.get("categories");
  var movies = GM_SuperValue.get("movies");
  var movie_id = location.search.replace(/.*id=([0-9]+).*/, '$1');
  var notes = '';
  var cat = 'Uncategorized';
  var parent_div = createElement('<div class="panel"><div class="panel__heading"><span class="panel__heading__title">Bookmark Notes</span></div></div>');
  var div = createElement('<div class="panel__body"><div>');
    if (movie_id in movies) {
      notes = movies[movie_id]['notes'];
      cat = movies[movie_id]['category'];
    }
    var select = createElement('<select class="form__input" style="width: auto;"><option value="">Uncategorized</option></select>')
    for (var i in cats) {
      var c = cats[i];
      var option = createElement('<option value="'+c+'">'+c+'</option>');
      if (c == cat) {
        option.selected = "selected";
      }
      select.appendChild(option);
    }
    var save = createElement('<a href="javascript:;"> [Save]</a>');
    save.addEventListener('click', saveTorrentPage);
    div.append(save);
    div.append(select);
    div.append(createElement('<div><textarea placeholder="Notes">'+notes+'</textarea><br/></div>'));
    parent_div.appendChild(div)
    document.querySelector('#movieinfo').after(parent_div);
}

function saveTorrentPage(event) {
    var movies = GM_SuperValue.get("movies");
    var movie_id = location.search.replace(/.*id=([0-9]+)/, '$1');
    var cat = this.parentNode.children[2].value;
    var notes = this.parentNode.children[3].children[0].value;
    var successColor = "#20b83e";
    var successIcon = "☑";
    movies[movie_id] = {
        'notes': notes,
        'category': cat
    }
    GM_SuperValue.set("movies", movies);
    var success = createElement('<span style="color: '+successColor+';">'+successIcon+'</span>');
    this.appendChild(success)
    setTimeout(function(){
         success.parentNode.removeChild(success)
    }, 1000);
}

ready(function() {
    if (document.location.pathname.includes("bookmarks.php")) {
        insertSidebarLink("Manage categories", editCategories);
        loadCategories();
        displayBookmarkInfo();
        showFormFilter();
    } else if (document.location.pathname.includes("torrents.php")) {
        if (document.location.search.includes("id=")) {
          loadCategories();
          addTorrentPage();
        } else {
          loadCategories();
          addTorrentSearchPage();
        }
    }
});