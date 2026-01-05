// ==UserScript==
// @name        FastTech Forum Enhancements
// @namespace   ftil
// @description Improvements for the FastTech forums and store
// @include     https://*.fasttech.com/*
// @version     2.5.1
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-start
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAOVBMVEVMaXEega+SlJeSkpgggK+Tk5gfgq+SlJeSkpkegK8egK8fgK+Tk5d1jZ6SkpcfgLEegLCTlJgfgbBPYHHZAAAAEXRSTlMApS2cl95Qi1CMvOmzFGgsdPNojJcAAACSSURBVHgBzdJlAgIwCAbQb915/7vaumG3vt8DRuAmIwheJOGQ2ywCvs8qYMVgsFLZSuiBrWhc4jsD8cIDrgh++qDNDM49MHmP4+wDDuIPHyRrE04VXbBlqZQ0hdhmKqXQZwwQaogcKD4MEt+QDMGLo8BvHe3qQTwwAJJjgyajPu/9Dwoj5MmDky6SEAlElYPGTUsirRDoa4UEWgAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/16070/FastTech%20Forum%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/16070/FastTech%20Forum%20Enhancements.meta.js
// ==/UserScript==
'use strict';
// Delay function calls until their preconditions have been met.
var block = (function() {
  var counters = { };

  return {
    get: function(name) { return counters[name].val !== 0; },

    block: function(name) {
      var c = counters[name];
      if (c === undefined)
        counters[name] = { val: 1, watches: [] };
      else if (c.val !== 0)
        c.val++;
    },

    unblock: function(name) {
      var c = counters[name];
      if (c.val !== 0)
        c.val--;
      if (c.val === 0) {
        var w = c.watches;
        while (w.length !== 0)
          w.shift()();
      }
    },

    watch: function(name, func) {
      var c = counters[name];
      if (c.val !== 0)
        c.watches.push(func);
      else
        func();
    },
  };
})();
/* Userscript settings:
 * This is just terrible.  GM_[sg]etValue is used to initialize settings since
 * it's shared across subdomains, while localStorage is used to notify other
 * tabs of new settings.
 */
var settings = (function() {
  var settings = { };
  var watches = { };
  var prefix = 'ignore_list:';
  var prere = new RegExp('^' + prefix + '(.+)');
  var have_ls = (function() {
    try {
      localStorage.getItem('test');
      return true;
    } catch (e) {
      return false;
    }
  })();

  // Unblock after execution of the script
  block.block('ready');

  function inner_set(name, value) {
    // Ugh.
    if (JSON.stringify(settings[name].value) === JSON.stringify(value))
      return false;
    settings[name].value = value;
    if (name in watches) {
      var w = watches[name];
      for (var i = 0; i < w.length; i++)
        w[i](name, value);
    }
    return true;
  }

  if (have_ls) {
    window.addEventListener('storage', function(e) {
      var set = e.key.match(prere);
      if (set !== null && set[1] in settings)
        inner_set(set[1], JSON.parse(e.newValue));
    });
  }

  function get_sync(name) {
    var val = GM_getValue(name, null);
    if (val !== null)
      return JSON.parse(val);
    else
      return settings[name].def;
  }

  return {
    get: function(name) { return settings[name].value; },
    get_sync: get_sync,

    set: function(name, value) {
      if (inner_set(name, value)) {
        var s = JSON.stringify(value);
        if (have_ls)
          localStorage.setItem(prefix + name, s);
        GM_setValue(name, s);
      }
    },

    all: function() { return settings; },

    register: function(name, desc, def, dep, opt) {
      settings[name] = {
        desc: desc,
        def: def,
        dep: dep,
        opt: opt,
      };
      inner_set(name, get_sync(name));
    },

    watch: function(name, func) {
      if (!(name in watches))
        watches[name] = [];
      watches[name].push(func);
      if (settings[name] !== undefined)
        func(name, settings[name].value);
    },

    update: function() { block.unblock('ready'); },
  };
})();
// Dynamic stylesheets
var styles = (function() {
  var urls = {};
  var txts = {};
  var elms = {};
  var active_elm;

  function try_gmgrt(name) {
    try {
      return GM_getResourceText('theme_' + name);
    } catch (e) {}
  }

  function apply() {
    var enable = settings.get('use_theme');
    var name = settings.get('theme_name');

    if (enable === true && name !== undefined) {
      if (active_elm !== undefined) {
        if (active_elm === elms[name])
          return;
        active_elm.disabled = true;
      }

      if (name in elms) {
        elms[name].disabled = false;
      } else {
        var e, u;
        var c = try_gmgrt(name);
        if (c === undefined || c === null) {
          u = urls[name];
          c = txts[name];
        }
        if (c !== undefined) {
          e = document.createElement('style');
          e.type = 'text/css';
          e.innerHTML = c;
        } else {
          e = document.createElement('link');
          e.rel = 'stylesheet';
          e.type = 'text/css';
          e.href = u;
        }
        document.head.appendChild(e);
        elms[name] = e;
      }

      active_elm = elms[name];
    } else if (active_elm !== undefined) {
      active_elm.disabled = true;
      active_elm = undefined;
    }
  }

  return {
    register: function(name, url, txt) {
      if (url !== undefined)
        urls[name] = url;
      if (txt !== undefined)
        txts[name] = txt;
    },

    update: function() {
      settings.watch('use_theme', apply);
      settings.watch('theme_name', apply);
    },
  };
})();
// Sanitize external values that may be fed into an innerHTML
var strip_tags = (function() {
  var div = document.createElement('div');
  return function(t) {
    div.innerHTML = t;
    return div.textContent;
  };
})();

// Case-insensitive indexOf (needed in case of case errors in user input)
function ci_indexof(a, n) {
  var l = n.toLowerCase();
  for (var i = 0; i < a.length; i++) {
    if (a[i].toLowerCase() === l)
      return i;
  }
  return -1;
}

// Case-insensitive attribute lookup
function ci_lookup(a, n) {
  var l = n.toLowerCase();
  for (var k in a) {
    if (k.toLowerCase() === l)
      return k;
  }
}
// Assorted generic handlers for user input.
var handlers = (function() {
  function Handler(funcs, elm, data, extra) {
    this.elm = elm;
    this.data = data;
    this.extra = extra;
    if (funcs.setting !== undefined)
      settings.watch(data, funcs.setting.bind(this));
    for (var k in funcs) {
      if (k.slice(0, 2) === 'on')
        elm.addEventListener(k.slice(2), funcs[k].bind(this));
    }
  }

  function handler(fs) {
    return function(e, d, x) { return new Handler(fs, e, d, x); };
  }

  return {
    generic: handler,

    ignore_toggle: handler({
      onclick: function() { ignore_list.set(this.data); }
    }),

    checkbox: handler({
      onchange: function() { settings.set(this.data, this.elm.checked); },
      setting: function(n, v) { this.elm.checked = v; }
    }),

    top_click: handler({
      onclick: function() { scrollTo(0, 0); }
    }),

    hide_toggle: handler({
      onclick: function() { unhide_posts.set(this.data); }
    }),
  };
})();
// Manage the state of the ignore list
function create_ignore_list(list_var) {
  // Use two stages so that filters can handle updates before being called
  var watches = { 'early': [], 'late': [] };
  var il = [];

  function fire_watches(user, state, idx) {
    ['early', 'late'].forEach(function(stage) {
      var w = watches[stage];
      for (var i = 0; i < w.length; i++)
        w[i](user, state, idx);
    });
  }

  function inner_set(user, state, idx) {
    // In order to support userscripts, we need to rebuild the list on every set
    if (settings.get_sync) {
      il = [];
      var l = settings.get_sync(list_var);
      for (var i = 0; i < l.length; i++)
        il.push(l[i]);
    }
    if (state)
      il.push(user);
    else
      il.splice(idx, 1);
    settings.set(list_var, il);
    fire_watches(user, state, idx);
  }

  settings.register(list_var, null, [], null);
  // Watch for ignorelist changes, and fire incremental watch events
  settings.watch(list_var, function(name, val) {
    var i, j;
    if (il.length === val.length)
      return;
    if (il.length === 0) {
      for (i = 0; i < val.length; i++)
        il.push(val[i]);
      fire_watches(il, true);
      return;
    }
    i = 0;
    j = 0;
    while (true) {
      if (il[i] === undefined && val[j] === undefined)
        break;
      if (il[i] !== val[j]) {
        var user, state, idx;
        if (il[i] === undefined) {
          // New entry @ end of list: user added
          user = val[j];
          il.push(user);
          state = true;
          idx = i;
        } else {
          // Missing entry inside list: user removed
          user = il[i];
          il.splice(i, 1);
          state = false;
          idx = i;
        }
        fire_watches(user, state, idx);
        continue;
      }
      i++;
      j++;
    }
  });

  return {
    // Get ignored state of user (true == ignored)
    get: function(user) { return (ci_indexof(il, user) !== -1); },

    // Set ignored state of user (undefined == toggle)
    set: function(user, state) {
      var idx = ci_indexof(il, user);
      if (state === undefined)
        state = (idx === -1);
      if ((state && (idx === -1)) || (!state && (idx !== -1)))
        inner_set(user, state, idx);
    },

    /* Watch the ignorelist for changes (stage == ('early'|'late')).
     * func may be called with a single user and a new state, or an array of
     * users (with implicit ignored state for all)
     */
    watch: function(stage, func) {
      watches[stage].push(func);
      if (il !== [])
        func(il, true, -1);
    },
  };
}
/* Core post filtering logic
 * post vars are expected to be in the format
 * { user: string, content_elm: element, post_elms: [element] }
 */
var post_filter = (function() {
  var posts;
  var watches = [];
  var filters;

  settings.register('hide_ignored', 'Hide posts by ignored users', true, null);
  block.block('filter');

  function update() {
    if (posts === undefined)
      return;

    for (var i = 0; i < posts.length; i++) {
      var post = posts[i];
      var hide = false;
      var j;
      for (j = 0; j < filters.length; j++) {
        var tmp = filters[j](post);
        if (tmp === true) {
          hide = true;
        } else if (tmp === false) {
          hide = false;
          break;
        }
      }

      var display = hide ? 'none' : '';
      for (j = 0; j < post.post_elms.length; j++)
        post.post_elms[j].style.display = display;

      for (j = 0; j < watches.length; j++)
        watches[j](post, hide);
    }

    block.unblock('filter');
  }

  function builtin() {
    filters = [];
    filters.unshift((function() {
      settings.watch('hide_ignored', post_filter.update);
      ignore_list.watch('late', post_filter.update);

      return function(post) {
        if (settings.get('hide_ignored') && ignore_list.get(post.user))
          return true;
      };
    })());
    unhide_posts = (function() {
      var posts = [];

      filters.unshift(function(post) {
        if (posts.indexOf(post) !== -1)
          return false;
      });

      return {
        // Set the unhide state of a post (true == unhide, undefined == toggle)
        set: function(post, state) {
          var idx = posts.indexOf(post);
          if (state === undefined)
            state = (idx === -1);
          if (state && idx === -1)
            posts.push(post);
          else if (!state && idx !== -1)
            posts.splice(idx, 1);
          else
            return;
          post_filter.update();
        }
      };
    })();
  }

  return {
    // Register a list of posts to be filtered
    register: function(list) {
      posts = list;
      update();
    },

    /* Add a new filter.  Filters return true (should hide), false (must not
     * hide), or undefined (no judgement).  Does not trigger update().
     */
    filter: function(func) {
      if (filters === undefined)
        builtin();
      filters.push(func);
    },
    // Run all filters again
    update: update,

    /* Call func with changes to the hidden status of each post (true ==
     * hidden).  Does not trigger update().
     */
    watch: function(func) { watches.push(func); },
  };
})();

var unhide_posts;
// Generic buttons to toggle ignored state of a user
var ignore_buttons = (function() {
  var posts;
  var inner_ign = '';
  var inner_unign = '';

  function update_btns(users, state) {
    var i;
    if (users instanceof Array) {
      for (i = 0; i < posts.length; i++) {
        posts[i].ignbtn.innerHTML =
            ci_indexof(users, posts[i].user) !== -1 ? inner_unign : inner_ign;
      }
    } else {
      var ul = users.toLowerCase();
      for (i = 0; i < posts.length; i++) {
        if (!ul.localeCompare(posts[i].user.toLowerCase()))
          posts[i].ignbtn.innerHTML = state ? inner_unign : inner_ign;
      }
    }
  }

  return {
    // Set the (HTML) format of the (un)ignore buttons
    set: function(ign, unign) {
      inner_ign = ign;
      inner_unign = unign;
    },

    // Register posts to have their ignore buttons handled
    register: function(p) {
      posts = p;
      for (var i = 0; i < p.length; i++)
        handlers.ignore_toggle(p[i].ignbtn, p[i].user);
      ignore_list.watch('late', update_btns);
    },
  };
})();
// Handle RES-style tagging of users
var user_tags = (function() {
  var posts;

  function update_badges(n, val) {
    for (var i = 0; i < posts.length; i++) {
      var post = posts[i];
      var k = ci_lookup(val, post.user);
      post.badge.innerHTML = k !== undefined ? val[k] : post.saved_badge;
    }
  }

  var tag_prompt = handlers.generic({ onclick: function(e) {
    e.preventDefault();
    e.stopPropagation();

    var user = this.data;
    var tmp =
        (settings.get_sync ? settings.get_sync : settings.get)('user_tags');
    var def = '';
    if (tmp[user] !== undefined)
      def = tmp[user];
    var tag = prompt('Tag for ' + user + ' or blank for default:', def);
    if (tag === null)
      return;
    tag = strip_tags(tag);

    // Ugh.
    var tags = { };
    for (var u in tmp)
      tags[u] = tmp[u];

    if (tags[user] !== undefined && tag === '')
      delete tags[user];
    else if (tag !== '')
      tags[user] = tag;
    settings.set('user_tags', tags);
  }});

  return {
    // Register posts to have their badges handled
    register: function(p) {
      posts = p;
      for (var i = 0; i < p.length; i++) {
        var post = p[i];
        post.saved_badge = post.badge.innerHTML;
        tag_prompt(post.badge, post.user);
      }
      settings.watch('user_tags', update_badges);
    },

    update: function() {
      settings.register('user_tags', null, { }, null);
    },
  };
})();
// Track the last viewed page and post count for threads
var last_viewed = (function() {
  var db;
  var store = 'thread_data';

  function GetCmd(args) { this.args = args; }
  GetCmd.prototype.mode = 'readonly';
  GetCmd.prototype.success = function(e) {
    var t = e.target.result;
    if (t !== undefined)
      this.args.f(this.args.e, t.lvp, t.lpn, t.lp);
  };
  function SetCmd(args) { this.args = args; }
  SetCmd.prototype.mode = 'readwrite';
  SetCmd.prototype.success = function(e) {
    var t = e.target.result;
    if (t === undefined)
      t = {id: this.args.id};
    t.lvt = this.args.lvt;
    t.lvp = this.args.lvp;
    if (t.lpn === undefined || t.lpn < this.args.lpn) {
      t.lpn = this.args.lpn;
      t.lp = this.args.lp;
    }
    this.os.put(t);
  };
  GetCmd.prototype.exec = SetCmd.prototype.exec = function() {
    this.os = db.transaction(store, this.mode).objectStore(store);
    this.os.get(this.args.id).onsuccess = this.success.bind(this);
  };

  // Accumulate commands and fire them once idb is open
  var cmds = [];
  function run_cmds() {
    if (db === undefined || db === null)
      return open_db();

    var cmd;
    while ((cmd = cmds.shift()) !== undefined)
      cmd.exec();
  }

  // Open idb and maybe remove old threads
  function open_db() {
    if (db === undefined)
      db = null;
    else
      return;
    var req = indexedDB.open('ignore_list', 2);
    req.onupgradeneeded = function(e) {
      var tmp = e.target.result;
      if (!tmp.objectStoreNames.contains(store)) {
        var os = tmp.createObjectStore(store, { keyPath: 'id' });
        os.createIndex('lvt', 'lvt');
      }
    };
    req.onsuccess = function(e) {
      db = e.target.result;
      run_cmds();

      /* Periodically scrub the database (FIXME this is awful & may run in
       * multiple tabs simultaneously)
       */
      settings.register('lv_scrub_time', null, 0, null);
      settings.watch('lv_scrub_time', function(n, v) {
        var now = Date.now();
        if (v + 24 * 60 * 60 * 1000 > now)
          return;

        var tr = db.transaction(store, 'readwrite');
        var os = tr.objectStore(store);
        os.index('lvt')
            .openCursor(IDBKeyRange.upperBound(now - 60 * 24 * 60 * 60 * 1000))
            .onsuccess = function(e) {
              var c = e.target.result;
              if (c) {
                os.delete(c.primaryKey);
                c.continue();
              } else {
                settings.set('lv_scrub_time', now);
              }
            };
      });
    };
  }

  return {
    /* Record a visit to thread_id, on page last_viewed_page, with up to
     * last_post_nr (of id last_post_id) visible.  Should be called on every
     * (thread) pageview.
     */
    set: function(thread_id, last_viewed_page, last_post_nr, last_post_id) {
      cmds.push(new SetCmd({id: thread_id, lvp: last_viewed_page,
        lpn: last_post_nr, lp: last_post_id}));
      run_cmds();
    },

    // Call func with the view history of thread_id (and pass extra as well)
    get: function(thread_id, func, extra) {
      cmds.push(new GetCmd({id: thread_id, f: func, e: extra}));
      run_cmds();
    },

    update: open_db,
  };
})();
// Generic settings menu
var settings_menu = (function() {
  function mangle_opts(opts) {
    var ret = '';
    for (var k in opts)
      ret = ret + '<option value="' + k + '">' + opts[k].name + '</option>';
    return ret;
  }

  var watch_disable = handlers.generic({ setting: function(n, v) {
    this.elm.disabled = v ^ this.extra;
  }});

  var select = handlers.generic({
    onchange: function() { settings.set(this.data, this.elm.value); },
    setting: function(n, v) { this.elm.value = v; }
  });

  return {
    /* Attach a settings menu to elm.  Menus is a list of submenus, in the form
     * [ { title: 'str' | undefined, vars: [ "name" ] } ]
     */
    register: function(elm, menus) {
      var s = settings.all();
      var d = document.createElement('div');
      var html = '';
      var vs = [];
      for (var i = 0; i < menus.length; i++) {
        var menu = menus[i];
        if (i !== 0)
          html += '<hr></hr>';
        if (menu.title !== undefined)
          html += '<b>' + menu.title + '</b>';
        for (var j = 0; j < menu.vars.length; j++) {
          var v = menu.vars[j];
          vs.push(v);
          var sv = s[v];
          if (sv.opt !== undefined) {
            html += '<div><select style="margin-left: 21px">' +
                mangle_opts(sv.opt) + '</select></div>';
          } else {
            html += '<div><input type="checkbox" id="ilcb_' + v + '"></input>' +
                '<label for="ilcb_' + v + '">' + sv.desc + '</label></div>';
          }
        }
      }
      d.innerHTML = html;
      var e = d.firstElementChild;
      var depre = /(!)?(.*)/;
      function h(e, v) {
        var sv = s[v];
        if (sv.opt !== undefined)
          select(e, v);
        else
          handlers.checkbox(e, v);
        var d = sv.dep;
        if (d) {
          var ds = sv.dep.match(depre);
          var i = !ds[1];
          d = ds[2];
          watch_disable(e, d, i);
        }
      }
      while (e !== null) {
        if (e.tagName === 'DIV')
          h(e.firstElementChild, vs.shift());
        e = e.nextElementSibling;
      }
      elm.appendChild(d);
    }
  };
})();
// Display a nice menu for managing the ignorelist
var manage_menu = (function() {
  var menu_list;
  var menu_elms = [];
  var template = document.createElement('tr');
  template.innerHTML =
      '<td></td><td align="right"><a class="itmremove"></a></td>';

  function create_elm(user) {
    var tr = template.cloneNode(true);
    tr.firstElementChild.innerHTML = user;
    var a = tr.lastElementChild.firstElementChild;
    a.href = 'javascript:void(0)';
    handlers.ignore_toggle(a, user);
    if (this.appendChild)
      this.appendChild(tr);
    return { user: user.toLowerCase(), elm: tr };
  }

  function lc_comp(a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  }

  function update(user, state) {
    if (menu_list === undefined)
      return;
    if (user instanceof Array) {
      var frag = document.createDocumentFragment();
      menu_elms = user.sort(lc_comp).map(create_elm, frag);
      menu_list.appendChild(frag);
    } else {
      var lc = user.toLowerCase();
      var idx;
      if (state) {
        for (idx = 0; idx < menu_elms.length; idx++) {
          if (menu_elms[idx].user.localeCompare(lc) >= 0)
            break;
        }
        var elm = create_elm.call(0, user);
        menu_elms.splice(idx, 0, elm);
        if (idx + 1 < menu_elms.length) {
          menu_list.insertBefore(menu_elms[idx].elm, menu_elms[idx + 1].elm);
        } else {
          menu_list.appendChild(menu_elms[idx].elm);
        }
      } else {
        for (idx = 0; idx < menu_elms.length; idx++) {
          if (menu_elms[idx].user.localeCompare(lc) >= 0)
            break;
        }
        if (idx < menu_elms.length) {
          menu_elms[idx].elm.remove();
          menu_elms.splice(idx, 1);
        }
      }
    }
  }

  var addbox_enter = handlers.generic({
    onkeydown: function(k) {
      if (k.which !== 13)
        return true;

      k.stopPropagation();
      k.preventDefault();

      ignore_list.set(strip_tags(this.elm.value), true);
      this.elm.value = '';

      return false;
    }
  });

  var addbox_click = handlers.generic({
    onclick: function() {
      ignore_list.set(strip_tags(this.data.value), true);
      this.data.value = '';
    }
  });


  return {
    // Attach management elements to elm
    register: function(elm) {
      var tbl = document.createElement('table');
      tbl.className = 'itmanage';
      tbl.innerHTML = '<tbody><tr><td colspan="2">' +
          '<input type="text" placeholder="Add user..." width="auto">' +
          '</input> <div class="il_addbtn">Add</div></td></tr></tbody>';
      menu_list = tbl.firstElementChild;

      var td = menu_list.firstElementChild.firstElementChild;
      addbox_enter(td.firstElementChild);
      addbox_click(td.lastElementChild, td.firstElementChild);

      ignore_list.watch('late', update);
      elm.appendChild(tbl);
    },
  };
})();
// Where are we?
// In the interest of sanity, ftl.thread is true for all thread-like pages
// (i.e. any page with one or more posts); ftl.threadlist is true for all
// threadlist-like pages (i.e. any page with a list of threads).  The
// formatting for all such pages is similar enough to treat them equivalently.
var ftl = {
  // Mobile pages
  mobile: '^https?://m\\.',
  // All forum pages
  forums: '^https?://(m|www)\\.fasttech\\.com/forums',
  // Thread-like pages (i.e. those with posts)
  thread: '^https?://(m|www)\\.fasttech\\.com/forums/[^/]+/t/[0-9]+/.',
  // Permalink pages
  perma: '^https?://(m|www)\\.fasttech\\.com/forums' +
      '/[^/]+/t/[0-9]+/[^/]+\\?[0-9]+$',
  // Threadlist-like pages (i.e. those with thread links)
  threadlist: '^https?://(m|www)\\.fasttech\\.com/forums' +
      '(/[^/]+(/page/[0-9]+)?(/search\\?.*)?)?$',
  // Lists of threads for a single author
  author: '^https?://(m|www)\\.fasttech\\.com/forums/author/',
  // Lists of threads for a single product
  product: '^https?://(m|www)\\.fasttech\\.com/p(roducts?)?/',
  // New thread page for a product
  pnthread: '^https?://(m|www)\\.fasttech\\.com/forums/[0-9]+/post',
  // Forum settings page
  settings: '^https?://www\\.fasttech\\.com/forums/settings$',
  // New arrivals pages
  new_arrivals: '^https?://(m|www)\\.fasttech\\.com/category/1/new-products',
  // Review pages
  reviews: '^https?://(m|www)\\.fasttech\\.com/reviews',
  // Product search
  prsearch: '^https?://(m|www)\\.fasttech\\.com/search',
  // Product category
  prcategory: '^https?://(m|www)\\.fasttech\\.com/c(ategory)?(/|$)',
};
for (var k in ftl)
  ftl[k] = new RegExp(ftl[k]).test(location.href);
// ftl.editor matches all pages with a post editor
ftl.editor = ftl.thread ||
    (ftl.threadlist && !ftl.settings && !ftl.author) ||
    ftl.pnthread;
// ftl.threadlist matches all pages listing threads
ftl.threadlist = ftl.threadlist || ftl.author || ftl.product || ftl.settings;
// ftl.forums matches all pages with forum elements (threads or posts)
ftl.forums = ftl.forums || ftl.product;
// ftl.reviews matches all pages with reviews
ftl.reviews = ftl.reviews || ftl.product;

if (ftl.thread || ftl.settings) {
  // Menu configuration
  var full_menus = [
    { title: 'Browsing', vars: ['use_theme', 'theme_name', 'track_viewed',
      'track_posts', 'always_unread', 'hide_threads'] },
    { title: 'Posting', vars: ['quote_quotes', 'quote_imgs'] },
    { title: 'Thread Menu', vars: ['inthread_menu', 'inthread_manage'] },
    { title: 'Post Hiding', vars: ['placeholders', 'hide_ignored',
      'hide_quotes', 'hide_deleted'] },
  ];
  var thread_menu;
  if (true) {
    thread_menu = [
      { title: 'General', vars: ['use_theme', 'quote_quotes', 'quote_imgs'] },
      { title: 'Post Hiding',
        vars: ['hide_ignored', 'hide_quotes', 'hide_deleted'] },
    ];
  } else {
    thread_menu = full_menus;
  }

  settings.register('inthread_menu', 'Show menu in thread toolbar', true, null);
  settings.register('inthread_manage', 'Manage ignored users from the menu',
      false, 'inthread_menu');
  settings.register('placeholders', 'Show placeholders for hidden posts', true,
      null);
  settings.register('hide_quotes', 'Hide posts quoting ignored users', false,
      'hide_ignored');
  settings.register('hide_deleted', 'Hide deleted posts', true, null);
  settings.register('quote_quotes', 'Include quotes in quotes', true, null);
  settings.register('quote_imgs', 'Include images in quotes', true, null);
}
if (ftl.threadlist) {
  settings.register('track_viewed', 'Link to last viewed page', false, null);
  settings.register('track_posts', 'Link to unread posts', true, null);
  settings.register('always_unread', 'Always show unread posts button', false,
      'track_posts');
  settings.register('hide_threads', 'Hide threads by ignored users', false,
      null);
}
if (ftl.editor) {
  settings.register('agree_tou', null, false, null);
}

block.block('ready');
if (ftl.forums) {
  var ignore_list = create_ignore_list('ignorelist');
  last_viewed.update();
  if (ftl.thread || ftl.reviews)
    user_tags.update();
  block.block('late');
  block.watch('ready', function() {
    setTimeout(function() { block.unblock('late'); }, 0);
  });
} else if (ftl.new_arrivals) {
  var ignore_categories = create_ignore_list('ignored_categories');
} else if (ftl.reviews) {
  user_tags.update();
}

settings.update();

if (document.readyState === 'loading') {
  document.addEventListener('readystatechange', function() {
    if (document.readyState === 'interactive') block.unblock('ready');
  });
} else {
  block.unblock('ready');
}

/* Fix up display of certain post elements:
 *  - Fix align tags (which should have been 100% divs to begin with)
 *  - Avoid breaking SKU links across lines
 */
var style = document.createElement('style');
style.innerHTML =
    '.PostContent span[style*="text-align:"] {display:block;width:100%}\n' +
    'a.SKUAutoLink {display: inline-block}\n' +
    '.PopoutPanel>ul {margin: -5px -20px 0px -50px!important}\n' +
    '.PopoutPanel>p {margin: 0px!important}\n' +
    '.Badges {cursor:pointer}\n' +
    '.itmanage tbody tr td {padding:0px}\n' +
    '.itmanage .itmremove {padding-left: 16px; height: 16px; background: ' +
    'url(https://www.fasttech.com/images/minus-button.png) no-repeat}';
document.head.appendChild(style);

// RE to pull a thread id from a URL
if (ftl.forums)
  var thread_id_re = new RegExp('/forums/[^/]+/t/([0-9]+)/[^?]*$');

if (ftl.thread) {
  // Add a filter for posts quoting ignored users
  post_filter.filter((function() {
    var quote_res = [];
    function new_qre(user) {
      quote_res.push(
          new RegExp('\\b' + user + ' wrote(</a>)?:?[\\r\\n]*<br>', 'i'));
    }

    function update(user, state, idx) {
      if (user instanceof Array) {
        quote_res = [];
        for (var i = 0; i < user.length; i++)
          new_qre(user[i]);
      } else {
        if (state)
          new_qre(user);
        else
          quote_res.splice(idx, 1);
      }
    }
    ignore_list.watch('early', update);
    settings.watch('hide_quotes', post_filter.update);

    return function(post) {
      if (settings.get('hide_ignored') && settings.get('hide_quotes')) {
        for (var i = 0; i < quote_res.length; i++) {
          if (quote_res[i].test(post.content_elm.innerHTML))
            return true;
        }
      }
    };
  })());

  // Add a filter for posts that the admins have deleted
  post_filter.filter((function() {
    var deleted_re = /post deleted/i;
    var edited_re = /^[ \r\n]*$/;
    settings.watch('hide_deleted', post_filter.update);

    return function(post) {
      if (settings.get('hide_deleted')) {
        var wb = post.content_elm.getElementsByClassName('WarningBox')[0];
        if ((wb !== undefined && deleted_re.test(wb.innerHTML)) ||
            edited_re.test(post.content_elm.innerHTML))
          return true;
      }
    };
  })());

  // Get all post bodies, desktop and mobile
  var posts;
  block.watch('ready', function() {
    posts = [];
    var elms = document.getElementsByClassName('PostContent');
    for (var i = 0; i < elms.length; i++) {
      var pc = elms[i];
      var user = pc.getAttribute('data-username');
      if (user !== null)
        posts.push({ user: user, content_elm: pc });
    }
  });

  // Create a function to create placeholders as needed
  var gen_watch_filter = function(ph_func) {
    return function(post, state) {
      var placeholders = settings.get('placeholders');
      if (state && placeholders) {
        if (!post.placeholder)
          post.placeholder = ph_func(post);
        post.placeholder.style.display = '';
      } else {
        if (post.placeholder !== undefined)
          post.placeholder.style.display = 'none';
      }
    }
  };

  // Get this thread's ID
  var thread_id = location.href.match(thread_id_re);
  if (thread_id !== null && thread_id[1] !== undefined)
    thread_id = parseInt(thread_id[1]);
  else
    thread_id = undefined;
}

// Get the current and last pages from a pager element, desktop and mobile
function parse_pager(elm) {
  var cur, last, sel;
  if (elm === undefined || elm === null) {
    cur = last = 1;
  } else if (!ftl.mobile) {
    sel = elm.getElementsByClassName('PageLink_Selected')[0];
    if (sel !== undefined)
      cur = parseInt(sel.innerHTML);
    last = parseInt(elm.lastElementChild.previousElementSibling.innerHTML);
  } else {
    sel = elm.getElementsByClassName('active')[0];
    if (sel !== undefined)
      cur = parseInt(sel.firstElementChild.innerHTML);
    last = parseInt(elm.lastElementChild.firstElementChild.innerHTML);
  }
  return {
    cur: cur,
    last: last
  };
}

if (!ftl.mobile) {
  /* Jump-to-page boxes are broken site-wide.  Fix them.
   * The existing JumpToPage box could be fixed by changing "function (e)" to
   * "function (event)" in the event listener, but instead, I'm doing all this.
   */
  var fix_jtp = function() {
    var jtps = document.getElementsByClassName('JumpToBox');
    if (jtps.length === 0)
      return;

    var lastpg = parse_pager(jtps[0].parentElement).last;
    function handle_kp(k) {
      if (k.which === 13) {
        k.preventDefault();
        k.stopPropagation();
        var pg = parseInt(this.value);
        if (pg > 0 && pg <= lastpg)
          location.href = base[1] + pg + base[2];
      }
      return false;
    }

    for (var i = 0; i < jtps.length; i++) {
      var jtpbox = jtps[i];
      var as = jtpbox.parentElement.getElementsByTagName('a');
      if (as[0] !== undefined) {
        var base = as[0].href.match(new RegExp('(.*/)[0-9]+($|[?#/].*)'));
        if (base !== null)
          jtpbox.addEventListener('keypress', handle_kp);
      }
    }
  };
  block.watch(ftl.forums ? 'late' : 'ready', fix_jtp);
}

if (ftl.threadlist) {
  // Translate a post number into a page number, handling FT's off-by-one quirk
  var postnr_to_pagenr = function(post, maxpage) {
    return Math.floor(Math.min(maxpage, post / 10 + 1));
  };

  // Create a link to a specific page of a thread
  var gen_page_link = function(base, page, hash) {
    var ret = base;
    if (page !== 1)
      ret += '/' + page;
    if (hash)
      ret += '#' + hash;
    return ret;
  };
}

if (!ftl.mobile) {
  // Re-implement FT's PopoutMenu, only nicer
  var PM2 = (function() {
    var active, timeout;

    function show() {
      var p = active.par;
      var c = active.ch;
      p.className += ' focused';
      c.style.left = c.style.top = '0px';
      c.style.display = 'inline';
      var ppb = p.parentElement.getBoundingClientRect();
      var pb = p.getBoundingClientRect();
      var cb = c.getBoundingClientRect();
      c.style.left = Math.min(pb.left - cb.left,
          document.body.clientWidth - cb.width) + 'px';
      c.style.top = (ppb.bottom - cb.top) + 'px';
    }

    function hide() {
      if (active === undefined)
        return;
      active.par.className = active.cname;
      active.ch.style.display = 'none';
      active = undefined;
    }

    function min(pm) {
      clearTimeout(timeout);
      if (pm !== active)
        hide();
      active = pm;
      show();
    }

    function mout() { timeout = setTimeout(hide, 300); }

    function add_listeners(elem, pm) {
      elem.addEventListener('mouseover', min.bind(null, pm));
      elem.addEventListener('mouseout', mout);
    }

    /* Hack: we can't remove anonymous event listeners, so duplicate elements.
     * We hide the existing element to serve as a decoy for the original
     * PopoutMenu in case it hasn't run yet, then steal all its children.
     */
    function dupe(id) {
      var elm = document.getElementById(id);
      var nelm = elm.cloneNode(false);
      elm.style.display = 'none';
      while (elm.childNodes[0])
        nelm.appendChild(elm.childNodes[0]);
      if (elm.nextElementSibling)
        elm.parentElement.insertBefore(nelm, elm.nextElementSibling);
      else
        elm.parentElement.appendChild(nelm);
      return nelm;
    }

    var def = {dupe: true};
    return function(pm) {
      for (var k in def) {
        if (!(k in pm))
          pm[k] = def[k];
      }
      try {
        if (pm.dupe) {
          pm.ch = dupe(pm.ch || (pm.par.replace('Button', '') + 'Popout'));
          pm.par = dupe(pm.par);
        } else {
          pm.ch = document.getElementById(
              pm.ch || (pm.par.replace('Button', '') + 'Popout'));
          pm.par = document.getElementById(pm.par);
        }
        pm.cname = pm.par.className;
        pm.ch.style.padding = '20px';
        add_listeners(pm.par, pm);
        add_listeners(pm.ch, pm);
      } catch (e) {}
    };
  })();

  block.watch('ready', function() {
    ['Cart', 'Support', 'Community', 'Account']
        .forEach(function(n) { PM2({par: n + 'Button'}); });
    if (ftl.thread) {
      ['RateThread', 'ForumTools']
          .forEach(function(n) { PM2({par: n}); });
    }
  });
}
styles.register('nightmode', undefined,
    '#SearchKeywords,#images ol,#searchBarCategory,button.close{background:0 ' +
    '0!important}#images ol{border:0!important}.btn.active,li.active>a{backgr' +
    'ound:#0d7bad!important}.FormButton.green{background:#20944b!important}#P' +
    'roductDetails,#RightPanel,#categoryButton,#container .list-group li a,#f' +
    'ooter,#searchBarOptionsCell,#searchBoxCell,#searchButtonCell,.AFEntry,.A' +
    'ttachments,.BGShadow,.BGShadowLight,.OrdersShipmentHeading,.PageNavigati' +
    'onalPanel,.ProductBackdrop,.ProductFilters,.ProductsGrid,.TicketResponse' +
    ',.TicketResponseFrame,.alert-info,.jumbotron,.list-group li,.mbbc-popups' +
    ' li,.mbbc-popups ul,.ui-dialog,body,td.Pros,ul.nav a{background:#222!imp' +
    'ortant}.FormButton.blue{background:#3182b9!important}#AccountButton.focu' +
    'sed,#LeftPanel,#UpdateWarningMsg,#container li a,#container li.active a.' +
    'dropdown-toggle,#container ol,#navbar>tbody>tr:first-child,.CardShadow,.' +
    'ControlArrows,.FilterEntry:hover,.FormButton.white,.ForumHeader,.ForumLi' +
    'nk:hover,.GridItem,.PopoutPanel,.ProductGridItem,.ProductPanelBackdrop,.' +
    'ReviewContent,.Steps>div,.btn,.dropdown-menu,.dropit-submenu>li,.mbbc-po' +
    'pups li:hover,.navbarsearch,.panel-body,.panel-heading,.panel-title,.tab' +
    'le,.table td,.tabs-min,button,div.well,input:not([valbbcode]),select,tex' +
    'tarea,ul.dropdown-menu>li>a{background:#333!important}.FilterSelected,.F' +
    'orumLink.Selected,.PageLink:hover,.StaticPageLink_Selected,.divider,.dro' +
    'p-hover>a,.dropit-submenu,.subCategories li:hover,hr{background:#444!imp' +
    'ortant}.FormButton.purple{background:#6a3b7f!important}.FormButton.red{b' +
    'ackground:#9e1531!important}.FormButton.orange{background:#c4571d!import' +
    'ant}.topLevelCategories li.focused{background-image:url(data:image/png;b' +
    'ase64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAZklEQVR4AWPwySwkG1' +
    'NPs2TjRjuyNUs0brwl0bRxj3jzei2yNEs2bfwPwkBD+sTb1wuQrhlhwCvJ5o25ZGhGYJA4KD' +
    'zI0YwwpGF9LMmaQYEIsplkP0s0b4wnO7TpE88gTXRN22RjAIeVNYXGl+mUAAAAAElFTkSuQm' +
    'CC)!important;background-position:right 2px!important;background-repeat:' +
    'no-repeat!important}.mbbc-buttons li{background-image:url(data:image/png' +
    ';base64,iVBORw0KGgoAAAANSUhEUgAAAGwAAACVCAMAAACKJe8uAAAAjVBMVEVMaXG0UlJg' +
    'YmS+kI/MzMzMzMzMzMzMzMzAxLuoqKiamppWV1cuLi7MzMzMzMzAx8qNjo5FRUaoRkZ8fH1N' +
    'Tk/MzMzMzMyUPz55OjfMzMzMzMzMzMzMzMzMzMxWeJzJbgbGpxKCoqY8YIC5uqhzqsmwlV99' +
    'pIB1lTxlghlvfMlxYbKnRy1sk7skfGsNbDRy3rXhAAAAHnRSTlMA/////42hdf//////s8L/' +
    '///////W6///NiMRW0Sx+uQWAAAC5klEQVR4AezSRZLAMAxEUY3SQTkM8v0vOhxG7fNdXr9A' +
    '09vbqo9VZIuZTVaARcGshVEUhfGNlaSZWDDAwWFsxgggylFcWSWzVGLD0lOMgKv3YqLagjVA' +
    '61rnHH4OGguWsnxjnQn7ZY6xEP0FxmXdjZYFcz93i/XDzS+rK5NFzXqNTz8jM39bTkwWabNK' +
    'N1gBnGz+2yJr2gD4YXCI5cChxVzVzo6NzDE2IDq0SMbNm7HfgwBYYBHQR31xsnkiqToz5hvF' +
    'yCkaTw/ijEVau0VeFQr8Xqg+wkiqcfNGzOsi/wyjrvtip761hllBKAzvArGSTtcS8P5v8/x+' +
    'OceRk3iaPd07+QetXXsGKaX0bzQLl4kolRRhWBBnVIRRmghTB+III4yRI4yTIUzriKKV+kKk' +
    'lFJKiZ7ABZyZF6CFi+JSzlyX45lCjm3Y+1eGH6jNsMaLmJNiE1yr745/JXbBM+tigAVdWaWx' +
    'Sz+4MvyADxJFyJWtPxpRnW/G+MNnhu/ixsyNRsFTk/whdqVdQSU8Jw27tS5+Zl13seE561IL' +
    'Oy4mUpzF8JIuu/7faLCl+BvJI0dKKaUvMbe7xXHOhm3tPax2u13BcZXmw56m1LAZMY5jcmyF' +
    'Fr7F1jOGLxikD/sti55Z+AIivVuLiPVeFHa7h28jbXy3DWcJbQ971twNuduGw6aMog+bUkop' +
    'fYPI7U43Xcdj2LTVWbqExHQ4UKmExDoDKDQjYnUYgDYQERsMwAZHxBY5ACaPiFWagHeyiJhT' +
    'sVpF1HHYEKDTcPRR8V8jzw4OG3IPKaX/vb/aqQcchmIAAMPzmjzGC2rz/rebbfvvAb7637eX' +
    'rdfYCq13DwxjnBFCMkrpLtYBoJrVYQ/HOCFUTKuegGEphNL0XtjRMwO1ENQYfS/MWps55zLv' +
    '/S5WjTdQG2PUV2JCmSedmZo0oEqBu2AhhCzGmKWUdjFu9CzDn4EtegIGxj/IeIzrPP7MqlVj' +
    '7LEhtuoWbAQUelFEFIeMmgAAAABJRU5ErkJggg==)!important;border-radius:5px!im' +
    'portant}.HourGlass{background:inherit!important}.Stars{background:url(da' +
    'ta:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAXVBM' +
    'VEVMaXH/rVz/s2f/jCv/uGz/vXD+iSf+jSz+kjD+xH3+iiX+jCr+s2P/uG/+wXf+iif+m0T+' +
    'n0f+pE7+p1L+v3X+wHj+wn3/kjP/mD3/oEj/p1P/tGX/vnT/iCX/xX3uTskzAAAAF3RSTlMA' +
    '/grK/i3p1yHXJX7WA3aZbPXD7o2sP+NiEhsAAABkSURBVHgBZcvFAcMwEEXBL2aFzXb/ZUYY' +
    'fLdZQI0GfHaPnxo2Lt6iZls9bRDRbHwl17NGgjmOrGWeRmWBx1aVeEJ69GtSXrLyLkjdSY3S' +
    'rWhUqF3mKWmXjQmM7Z1BOQ1Yx/DXE5S8Bqiv9nzRAAAAAElFTkSuQmCC)!important}.Gra' +
    'yStars{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4A' +
    'AAAOCAYAAAAfSC3RAAAA4UlEQVR4AWLwySzEinfu3MkGwrjkcWo8efJk76lTp8pI0njmzBn7' +
    'Y8eO/T948OB/IG2AXyPCJl5AZ3RthjAARAF4F0omZBWquKfBrcPdOmyEMELk8XFxL+L5T0+n' +
    '04fgbDa7p5UcBk2Utt1u74fDwSE4nU6dwWCwkGW5JYpiw4coBRnwM444wtHtdh3TNB1FURye' +
    '558I8NNeJpNAGgpDjuPaMH5fKBEgDwmCsKd+Iz0SSEEo0UKJqVMdjUZfAmFEvWWuIwzCiGXZ' +
    'fEiA+sEB9IdWKkTTiBrfF+7xDkHisNbhAqOEltIAVAofAAAAAElFTkSuQmCC)!important}' +
    '.FilterEntry.FilterCancellable{background:url(data:image/png;base64,iVBO' +
    'Rw0KGgoAAAANSUhEUgAAAAwAAAALCAYAAABLcGxfAAAASklEQVR4AWPwySxkuCUk9J8QBqkD' +
    'YbBiYjGKBigAs3GJMTAwNDBgUYDOxtSAoQmhmCwNlDmJTE8TxggNiIgjrBimAYxBHEIYpA4A' +
    'F8kQ7Ga9snUAAAAASUVORK5CYII=) 10px 3px no-repeat,#444!important;border-c' +
    'olor:#0d7bad!important;box-shadow:0 2px 2px #111!important}input[src="/i' +
    'mages/errorreport.png"]{background:url(data:image/png;base64,iVBORw0KGgo' +
    'AAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAMFBMVEX////////////////////////////' +
    '///////////////////////////////////9Or7hAAAAAEHRSTlMBCBIcJS45RlVkcYOVqbz' +
    'NHir32QAAAGNJREFUeAEUTAkBBEEIUhMIDeAazPbvdjgvn0xVAXkCGocCwKcNaH4/9Sn08ym' +
    'Qae00DUBRAtbGIHJUDc1Y1DRuKRY25Y3/gOa8BwKQFe/ugcAHpnfv7p49e/bcPab/Z8HgPgC' +
    'LAx2nigq2jAAAAABJRU5ErkJggg==)!important}.CellMode .GridItemPrice{backgr' +
    'ound:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHUAAAAeCAYAAAASN' +
    '1ElAAAAi0lEQVR4Ae3aSRXDIABAwZiIjgrAQkV0X46VUT1RFAOV0M3Gf3MYBR8IEKbXfvMhZ' +
    'RG1Z4jasm7vj6kVlUswqlnaisqlFZX1Z25F5fmP2YrKHIxqlraiMovasvwjtqIyglHN0lZUR' +
    'iAqolp+sVHqcKTB5QOuCXGhj19vfpLjOQsenuGJKB5zM0TtWb7rxpkaVlv9JQAAAABJRU5Er' +
    'kJggg==) no-repeat!important;width:134px!important}.ForumHeader input[ty' +
    'pe=image]{border:0!important;vertical-align:text-top!important}#AddedToC' +
    'artPopupPanel,#container ol,.CardShadow,.ForumThread,.GridItem,.ProductG' +
    'ridItem,.ProductPanelBackdrop,.TicketResponseFrame,.dropit-submenu,.mbbc' +
    '-buttons li,.panel-body,.panel-heading,td.Pros{border:1px solid #444!imp' +
    'ortant}#searchBarOptionsCell,#searchBoxCell,#searchButtonCell,.ForumThre' +
    'ad tr td,.navbarsearch{border-bottom:1px solid #444!important}#Ignorelis' +
    'tPopout tr td,.PostFlags ul li{border-bottom:none!important}.FilterEntry' +
    ':hover,.FilterSelected,.StaticPageLink_Selected{border-color:#0d7bad!imp' +
    'ortant}#categoryButton,#container li a,#container ul,.ControlArrows,.For' +
    'umQuote,.ForumsNavigation,.PageLink,.PageNavigationalPanel,.PostFlags,.S' +
    'KUAutoLink,.Signature,.TightInformationBox,.list-group li,.mbbc-popups u' +
    'l,body .FormButton[class],div,hr,td{border-color:#444!important}.btn,but' +
    'ton,input:not([valbbcode]),select,textarea{border-color:#444!important;b' +
    'order-style:solid!important}#searchBarOptionsCell{border-left:1px solid ' +
    '#444!important}.ForumQuote{border-left:5px solid #0d7bad!important}.drop' +
    'it-submenu>li,blockquote{border:none!important}#searchButtonCell{border-' +
    'right:1px solid #444!important}.ForumLink.Selected,.ForumLink:hover{bord' +
    'er-right:3px solid #0d7bad!important}#searchBarOptionsCell,#searchBoxCel' +
    'l,#searchButtonCell{border-top:1px solid #444!important}#LeftPanel,.Popo' +
    'utPanel{box-shadow:0 15px 30px #111!important}.ProductGridItem{box-shado' +
    'w:0 3px 3px #111!important}.BGShadow,.BGShadowLight,.CardShadow,.FilterS' +
    'elected,.ForumLink.Selected,.GridItem,.StaticPageLink_Selected,.subCateg' +
    'ories li:hover{box-shadow:none!important}.SysMsgBanner{color:#000!import' +
    'ant}#AccountButton a{color:#0d7bad!important}#StaticPageContent [style],' +
    '#categoryButton a,#content_ProductName,#footer,.AFTitle,.ControlArrows a' +
    ',.FieldLabel,.FlagValue,.Gray,.GrayText,.GridItemDesc>div,.GridItemModel' +
    's,.Name>a,.NewList,.PageLink,.Pager,.btn,.dropit a,.navmenubutton a,.pan' +
    'el-default>.panel-heading,.panel-title,.subCategories a,.topLevelCategor' +
    'ies a,a.SortOrder,body,button,input:not([valbbcode]),select,textarea,ul.' +
    'dropdown-menu>li>a{color:#bbb!important}.mbbc-popups li{color:#ccc!impor' +
    'tant}.btn.active,body .FormButton[class],ul.dropdown-menu>li>a:hover{col' +
    'or:#fff!important}.GridItemPackSize{display:inline!important;float:none!' +
    'important;margin:0 0 0 -22px!important;vertical-align:sub!important}#DMC' +
    'A,.logo,.navseals,a[href$="/faq/money-back-guarantee"]>img{display:none!' +
    'important}#categoryButton{margin:0 20px!important}#footer,.PageContentPa' +
    'nel>div:last-child[style]{margin:0!important}#CartPopupClose{margin:-10p' +
    'x -20px!important}.mbbc-row1{margin-bottom:1px!important}.ForumLink:hove' +
    'r{margin-right:-3px!important}#Tab{margin-top:10px!important}#AddedToCar' +
    'tPopupPanel{padding:0 10px!important;position:fixed!important;right:40px' +
    '!important;top:40px!important}.menubuttons{padding:0 20px!important}#Ans' +
    'wer{padding:0!important}#searchbar{padding-right:20px!important}#AddedTo' +
    'CartPopupPanel,#categoryButton{width:auto!important}');

styles.register('darkft', undefined,
    '.FieldFlag,.Pager .PageLink{font-size:9pt!important}.Pager .PageLink:hov' +
    'er{background:#111!important;color:#fefefe!important}.FieldFlag{backgrou' +
    'nd:#1980b0!important;font-weight:400!important;padding:3px 5px!important' +
    '}.ForumLink.Selected{background:#222!important;border-right:3px solid #6' +
    '66!important}.ForumHeader,.ForumThread .ThreadCommandBar,.logo,body,div#' +
    'contents{background:#333!important}.logo{visibility:hidden!important}.Fo' +
    'rumThread tr td{background:#363636!important}#AccountButton.focused,#Acc' +
    'ountPopout,#AddedToCartPopupPanel,#CartPopout,#CartPopupPanel,#Community' +
    'Popout,#LeftPanel,#SupportPopout,#categoryButton,#categoryPopout,#navbar' +
    ',#searchBarOptionsButton,.CellMode .ProductGridItem,.FilterEntry:hover,.' +
    'FormButton.white,.FormButton.white:hover,.LargeFilterEntry:hover,.LineMo' +
    'de .ProductGridItem,.ModalDialog,.OrdersShipmentHeading,.PageNavigationP' +
    'anel,.ProductBackdrop,.ProductFilters,.ProductFilters .FilterCancellable' +
    ',.ProductFilters .FilterSelected,.ProductPanelBackdrop,.mbbc .mbbc-edito' +
    'r,div#footer,hr,tr{background:#444!important}.HourGlass{background:#444f' +
    'e5!important}.Cons .FieldFlag,.Pros .FieldFlag{background:#4c9ed9!import' +
    'ant}#navbar .focused,.BGShadow,.BGShadowLight,.PopoutPanel,.Steps .focus' +
    'ed{background:#666!important}.PopoutPanel{border-radius:0!important;box-' +
    'shadow:0 5px 5px #888!important}#searchBarCategory{background:#777!impor' +
    'tant}.Pager .ControlArrows{background:#888!important;font-weight:400!imp' +
    'ortant}.Pager .PageLink_Selected{background:#999!important}#ForumPopout,' +
    '#ForumToolsPopout,#RateThreadPopout{background:#fff!important}#CartButto' +
    'n,#CommunityButton,#SupportButton,#searchBarOptionsCell,#searchButtonCel' +
    'l,.GridViewIcon,.GroupViewIcon,.ProductGridMenu,.searchbar_focus #search' +
    'BarOptionsCell,.searchbar_focus #searchButtonCell{background-image:url(d' +
    'ata:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAJYBAMAAADh0yLyAAAAJ1B' +
    'MVEVMaXFqbG11dXX9/f3l5eXd3eBadIdWbnlWc4RYieRmZ2dpaWlsbW2OPQlLAAAADXRSTlM' +
    'A////////////r0YgYtO1qQAAAq9JREFUeAHt2sd160YYx9FxKgBcekc24ADsHTizVwBakEr' +
    'g6+CpgBdLcHYJLsA9KTmnZ0PQof+U7j0q4Hc+fMM0KvcAALpI9xsocL2K+/t94GoT6KACNyZ' +
    '4oIF20AQF2kGBdtAEBdpBgXbQBAXaQYF20AQF2kGBdtAEI5UMAAAA4V9oBC43938PV/sO3My' +
    '1FihQoECB+yBQoECBAgUKFChQoECBAgUKFChQoEA3TcsBAAAA9CXbUEuq+pOhpNoO/fVfTZ5' +
    'ga3Wqn6Y/4hLr3ToM4YFj9gRLHdIDb5VwyTuYPsFh4SExwXeGeh35YQEAAACAf/h1K/8aogq' +
    '8q7rt+74lB/bXhvjAfkwPrAIXHZKaHNj6oUYHXsf1/ZAcONRtn/5O0o/ZgW3rvTjx4xYAAAA' +
    'ArsIEtjrWlj3BbfojHrbxOziEBw7pE0x/xKfN6+ACday1tpY8wTF7gq2168ZxfHw76CoMAAA' +
    'AAM4ild+c7xL9PrBLdEiBT1ebQA8hUKBAgQIFChQoUKBAgQIFChQoUKBAgQIFChSYftN0cRE' +
    'ZmAEAAOBstrJfu7melP3q5hL4J5u54gN3AgUKFChQoECBAgUKFChQoECBAgUKFChQoMCMwN1' +
    'cjzgQAABgmt6bjqZJoEA8YoF4xHsgMA0AADD9ROBs2EHsoEDs4OEDAADaNH1akm1bbSXZONa' +
    'jo/CvnUfvlUUcklpryz4ktT2PPiRTe/08+pCMS3/68E7yXvg7yadH4e8kU0l/Jyl3BAAAfPm' +
    'T70uqzU/eTw9c/5Ae+P0jDRQoUKDArutWJrgwcP3QJ+iQdE5x+ATtoAl6oRYoUOAeCBRYUnU' +
    '/+aqk+vEnBQAAF9qRXGgLFChQoMBlXt9YCbSD/5+zGw7Jwgme28EFuht20Au1QIECBQp0oe1' +
    'COx0AAFf2ljch8gqLTAAAAABJRU5ErkJggg==)!important}#navbar tr.navbarsearch' +
    ',.navsealsbg,body.stripe{background-image:url(data:image/png;base64,iVBO' +
    'Rw0KGgoAAAANSUhEUgAAAGQAAABGAQMAAAAASKMqAAAAA1BMVE2.5EQ1TRdOAAAAEElEQVR4' +
    'AWMYVmAUjIJRAAAD1AABVz/btAAAAABJRU5ErkJggg==)!important}.searchbar_focus' +
    ' #searchBoxCell{background-image:url(data:image/png;base64,iVBORw0KGgoAA' +
    'AANSUhEUgAAAD0AAAAtBAMAAADvmn5BAAAAD1BMVEWYmJmzs7PBwcHGxsagoaK4fiRWAAAAI' +
    'ElEQVR4AWNiwA+YBPECgcGuf6DkR+VH5UflR+UpLd8AJUsIkz10gdcAAAAASUVORK5CYII=)' +
    '!important}#searchBoxCell{background-image:url(data:image/png;base64,iVB' +
    'ORw0KGgoAAAANSUhEUgAAAD0AAAAtAQMAAAAnevExAAAAA1BMVEV3d3dY20ihAAAADUlEQVR' +
    '4AWMYfGAUAAABlQABpWSZFgAAAABJRU5ErkJggg==)!important}.SysMsgBanner{borde' +
    'r:1px dotted #444!important}#DMCA div.dm-1,#DMCA div.dm-2,#LeftPanel,#ca' +
    'tegoryButton,#searchBarOptionsButton,.BorderedPanel,.FormButton,.ForumTh' +
    'read,.ForumThread .Signature,.InformationBox,.Pager .ControlArrows,.Page' +
    'r .PageLink,.Pager .PageLink_Selected,.ProductThumbnails,.Reviews .Cons,' +
    '.SKUAutoLink,.SingleLineTextBox,.TightInformationBox,.VerticalTextArea,.' +
    'WarningBox{border:1px solid #444!important}.ForumQuote{border:1px solid ' +
    '#555!important;border-left:5px solid #666!important}.mbbc .mbbc-editor{b' +
    'order:none!important}td{border-bottom:0!important}#ProductDetails .Attri' +
    'butesTableRowGroupTitle{border-bottom:1px dashed #444!important}.Discoun' +
    'tsTable,.ProductDescriptions,.fixedCategoryLink,.scHeading{border-bottom' +
    ':1px dotted #444!important}#navbar,.FilterHeading,.FooterBanner,.PostFla' +
    'gs ul li,.tabs-min .ui-widget-header{border-bottom:1px solid #444!import' +
    'ant}.SingleLineTextBox:focus,.VerticalTextArea:focus{border-color:#444!i' +
    'mportant}.ForumThread .Signature,.Reviews .ReviewContent{border-left:5px' +
    ' solid #444!important}.ForumsNavigation{border-right:0 solid #e0e0e0!imp' +
    'ortant}#ProductSpecifications,.FooterLeft,.navmenubutton_separator{borde' +
    'r-right:1px dotted #444!important}.PostFlags,td.PageNavigationalPanel{bo' +
    'rder-right:1px solid #444!important}.FilterEntry:hover,.LargeFilterEntry' +
    ':hover,.ProductFilters .FilterCancellable,.ProductFilters .FilterSelecte' +
    'd,.subCategories li:hover,div.StaticPageLink_Selected{border-right:3px s' +
    'olid #444!important}#navbar .hdivider,.FooterBanner,.OrdersShipmentHeadi' +
    'ng,.PopoutPanel{border-top:1px solid #444!important}.BGShadow{box-shadow' +
    ':0 1px 1px #666!important}.BGShadowLight{box-shadow:0 3px 3px #666!impor' +
    'tant}#CartPopout .ViewCart a:hover,#DMCA,#DMCA div.dm-1 a,#DMCA div.dm-2' +
    ' a,#ProductDetailsPanel .Price,#navbar .focused a,#searchButtonCell,.Cel' +
    'lMode .GridItemPrice,.FieldFlag a,.FormButton,.FormButton.blue:hover,.Fo' +
    'rmButton.green:hover,.FormButton.orange:hover,.FormButton.purple:hover,.' +
    'FormButton.red:hover,.LineMode .GridItemPrice,.MemberRankIndex,.Pager .P' +
    'ageLink_Selected,.Pager .PageLink_Selected:hover,.Pager .PageLink_Select' +
    'ed:visited,.Steps .focused,.Steps .focused .StepText,.Steps .focused .St' +
    'epTitle,.tabs-min .ui-state-default a,.unitSelector{color:#444!important' +
    '}.tabs-min .ui-state-active a{color:#666!important}#navbar .menulinks sp' +
    'an a:active,a,a:visited{color:#d5d5d5!important}#categoryButton,#searchB' +
    'arCategory,.CartTable .Name a,.CellMode .GridItemModels,.FormButton.whit' +
    'e,.FormButton.white:hover,.ForumThread .ThreadCommand,.Information,.Line' +
    'Mode .GridItemModels,.Pager .PageLink,.navmenubutton a,.subCategories a,' +
    '.topLevelCategories a,.topLevelCategories li.focused a{color:#e1e1e1!imp' +
    'ortant}.Black{color:#e2e2e2!important}.PageTitle{color:#e5e5e5!important' +
    '}#categoryButton a,.PostFlags .FlagValue,.SingleLineTextBox:focus,.Verti' +
    'calTextArea:focus{color:#f1f1f1!important}body{color:#f3f3f3!important}#' +
    'content_ProductName,.mbbc .mbbc-align-popup li,.mbbc .mbbc-code-popup li' +
    ',.mbbc .mbbc-editor,.mbbc .mbbc-font-popup li,.mbbc .mbbc-list-popup li,' +
    '.mbbc .mbbc-simple-popup li,.mbbc .mbbc-size-popup li,.subCategories a:h' +
    'over,.topLevelCategories a:hover,a:hover{color:#fff!important}.MemberRan' +
    'kUsername{font-weight:700!important}.ForumGroup{padding:3px 10px!importa' +
    'nt}.mbbc .mbbc-buttons ul{padding:5px 0 3px!important}.mbbc .mbbc-emotic' +
    'on-popup .mbbc-group li{padding:8px!important}');

settings.register('use_theme', 'Use custom theme', false, null);
settings.register('theme_name', null, 'nightmode', 'use_theme', {
  nightmode: { name: 'Night mode' },
  darkft: { name: 'Pafapaf\'s DarkFT' },
});
styles.update();
// Add a "Top of page" button at the bottom of the page, aligned with the pager
if ((ftl.thread && !ftl.perma) || (ftl.threadlist && !ftl.settings)) {
  var add_top_btn;
  if (!ftl.mobile) {
    add_top_btn = function() {
      var elm = document.getElementsByClassName('ForumThread TightTable')[0];
      if (elm)
        elm = elm.nextElementSibling;
      if (!elm)
        return;
      elm.className = 'Pager';
      var tbtn = document.createElement('span');
      tbtn.className = 'ControlArrows';
      tbtn.setAttribute('style', 'float: left; min-width: 150px; ' +
          'max-width: 250px; text-align: center');
      tbtn.innerHTML = '<a>Top of page</a>';
      tbtn.firstElementChild.href = 'javascript:void(0)';
      handlers.top_click(tbtn);
      var pager = elm.firstElementChild;
      elm.appendChild(tbtn);
      if (pager) {
        var pspan = document.createElement('span');
        pspan.appendChild(pager);
        elm.appendChild(pspan);
      } else {
        elm.parentElement
            .insertBefore(document.createElement('br'), elm.nextElementSibling);
      }
    };
  } else {
    add_top_btn = function() {
      var elm = document.getElementsByClassName('ListRow')[0];
      if (elm)
        elm = elm.parentElement.nextElementSibling;
      if (!elm)
        return;
      var tbtn = document.createElement('button');
      tbtn.className = 'btn btn-default';
      tbtn.innerHTML = 'Top';
      handlers.top_click(tbtn);
      if (elm.firstElementChild) {
        tbtn.style.marginTop = '-5px';
        elm = elm.firstElementChild;
        var td = document.createElement('td');
        td.style.textAlign = 'right';
        td.appendChild(tbtn);
        elm.style.width = '100%';
        elm.firstElementChild.firstElementChild.appendChild(td);
      } else {
        var d = elm.appendChild(document.createElement('div'));
        d.setAttribute('style', 'width: 100%; text-align: right; ' +
            'margin-bottom: 8px');
        d.appendChild(tbtn);
      }
    };
  }
  block.watch('ready', add_top_btn);
}

if (ftl.editor) {
  var bbeeditor; // element to scroll to
  var bbetext; // textarea
  var bbeexpand; // expand button (mobile)
  var bbepanel; // parent of editor
  if (!ftl.mobile) {
    var fix_editor = function() {
      if (bbetext === undefined)
        bbetext = document.getElementsByClassName('mbbc-editor')[0];
      if (bbetext !== undefined) {
        // Save & restore the editor text
        if (history.state && history.state.saved_post)
          bbetext.value = history.state.saved_post;
        window.addEventListener('pagehide', function() {
          var state = history.state;
          if (state === null)
            state = {};
          state.saved_post = bbetext.value;
          history.replaceState(state, '');
        });

        // Remove the broken size=[67] buttons
        var size_popup = document
            .getElementsByClassName('mbbc-size-popup')[0];
        if (size_popup !== undefined) {
          size_popup.lastElementChild.remove();
          size_popup.lastElementChild.remove();
        }
        // Fix the editor width
        bbetext.style.boxSizing = 'border-box';
        bbetext.style.width = '100%';
        // Add a YouTube button
        var url_btn = document.getElementsByClassName('mbbc-url')[0];
        if (url_btn !== undefined) {
          var yt_btn = document.createElement('li');
          yt_btn.innerHTML = '&nbsp;';
          yt_btn.className = 'mbbc-youtube';
          yt_btn.addEventListener('click', function() {
            var sp = bbetext.selectionStart;
            var ep = bbetext.selectionEnd;
            var sel;
            if (ep < sp) {
              sp = ep;
              ep = bbetext.selectionStart;
            }
            if (ep !== sp) {
              sel = bbetext.value.slice(sp, ep);
            } else {
              sel = prompt('Video URL:', '');
              if (sel === null)
                return;
              var vid = sel
                  .match(new RegExp('[/?=#]([-\\w]{11})([^-\\w]|$)'));
              if (vid !== null)
                sel = 'https://www.youtube.com/watch?v=' + vid[1];
            }
            if (sel === undefined)
              return;
            bbetext.value = bbetext.value.slice(0, sp) +
                '[youtube]' + sel + '[/youtube]' +
                bbetext.value.slice(ep);
            bbetext.selectionStart = bbetext.selectionEnd = sp + 9 +
                (sel === '' ? 0 : 10 + sel.length);
            bbetext.focus();
          });
          url_btn.parentElement.insertBefore(yt_btn, url_btn);
        }
      }
    };

    block.watch('late', function() {
      // Persist the terms of use checkbox
      var toubox = document.getElementById('AgreeTerms');
      if (toubox !== null)
        handlers.checkbox(toubox, 'agree_tou');

      bbeeditor = document.getElementById('bbEditor');
      if (bbeeditor !== null) {
        bbetext = bbeeditor.getElementsByClassName('mbbc-editor')[0];
        if (bbetext !== undefined)
          fix_editor();
        else
          new MutationObserver(function(es, mo) {
            mo.disconnect();
            fix_editor();
          }).observe(bbeeditor, { childList: true });
      }
    });
  } else {
    block.watch('ready', function() {
      bbetext = document.getElementById('RawContent');
      if (bbetext !== null) {
        bbepanel = bbetext.parentElement.parentElement.parentElement;
        bbeeditor = bbepanel.parentElement;
        bbeexpand = bbeeditor.previousElementSibling.firstElementChild
            .firstElementChild;
      }
    });
  }
}

if (ftl.thread && !ftl.perma) {
  // Re-implement quotes in a way that sort of works
  var fix_quote_btns = (function() {

    function wrap_tag(tag, val, str) {
      return '[' + tag + (val ? '=' + val : '') + ']' + str + '[/' + tag + ']';
    }

    function inner_quote(elm, range, depth) {
      var tmp = '';
      for (var e = elm.firstChild; e !== null; e = e.nextSibling) {
        var sp, ep;
        if (range !== undefined) {
          if (range.startContainer.compareDocumentPosition(e) === 2)
            continue;
          if (range.endContainer.compareDocumentPosition(e) === 4)
            break;
          if (range.startContainer === e)
            sp = range.startOffset;
          if (range.endContainer === e)
            ep = range.endOffset;
        }
        switch (e.tagName) {
          case 'BR':
            tmp += '\n';
            break;

          case 'STRONG':
            tmp += wrap_tag('b', '', inner_quote(e, range, depth));
            break;

          case 'EM':
            tmp += wrap_tag('i', '', inner_quote(e, range, depth));
            break;

          case 'HR':
            tmp += '[hr]';
            break;

          case 'P':
            if (e.innerHTML !== '')
              tmp += '\n' + inner_quote(e, range, depth);
            break;

          case 'SPAN':
            var y = e.style;
            var t = null;
            var v = '';
            if (y.textDecoration === 'underline') {
              t = 'u';
            } else if (y.textDecoration === 'line-through') {
              t = 'y';
            } else if (y.fontSize !== '') {
              t = 'size';
              v = parseInt(y.fontSize);
            } else if (y.color !== '') {
              t = 'color';
              v = y.color;
            } else if (y.textAlign !== '') {
              t = 'align';
              v = y.textAlign;
            } else {
              console.log('Unknown span!');
            }

            tmp += wrap_tag(t, v, inner_quote(e, range, depth));
            break;

          case 'DIV':
            if (e.className === 'ForumQuote') {
              if (tmp[tmp.length - 1] !== '\n')
                tmp += '\n';
              if (depth === 0 && settings.get('quote_quotes'))
                tmp += wrap_tag('quote', '',
                    inner_quote(e.firstElementChild, range, depth + 1).trim());
            } else {
              console.log('Unknown div!');
            }

            break;

          case 'IFRAME':
            var m = e.src.match(/youtube[^\/]*.com.*\/embed\/([^?]+)/);
            if (m !== null && m[1] !== undefined) {
              /* A YouTube tag inside a quote breaks the parsing of the quote.
              tmp += wrap_tag('youtube', '',
                'https://www.youtube.com/watch?v=' + m[1])
              */
              tmp += wrap_tag('url',
                  'https://www.youtube.com/watch?v=' + m[1], 'YouTube video');
            } else {
              console.warn('Unknown iframe!');
            }
            break;

          case 'IMG':
            if (settings.get('quote_imgs')) {
              tmp += wrap_tag('img', '', e.src);
            } else if (e.parentElement.tagName !== 'A') {
              tmp += wrap_tag('url', e.src, 'Image');
            } else {
              tmp += 'Image';
            }
            break;

          case 'A':
            if (e.className === 'SKUAutoLink') {
              tmp += e.textContent;
            } else {
              var do_quote = true;
              if ((depth > 0 || !settings.get('quote_quotes') &&
                  e.innerHTML.match(/\bwrote$/) !== null)) {
                // Is this a permalink for a quote we'll remove?
                var s = e;
                var l;
                do {
                  if (s.nextSibling === null) {
                    l = (l === undefined) ? s : l;
                    s = s.parentElement.nextSibling;
                  } else {
                    s = s.nextSibling;
                  }

                  /* Between the <a> and the <div>, we only want to see a
                   * colon and an unpredictable number of <br> and empty <p>
                   * elements.  The <div> may be outside the current element.
                   */
                  if (s.tagName === 'DIV' && s.className === 'ForumQuote') {
                    do_quote = false;
                    e = (l === undefined) ? s : l;
                    break;
                  } else if (s.tagName === undefined) {
                    if (s.textContent.match(/[^:\r\n]/) !== null)
                      break;
                  } else if (s.innerHTML !== '' ||
                      (s.tagName !== 'P' && s.tagName !== 'BR')) {
                    break;
                  }
                } while (true);
              }
              if (do_quote)
                tmp += wrap_tag('url', e.href, inner_quote(e, range, depth));
            }
            break;

          case undefined:
            // Filter out newlines and empty tags
            tmp += e.wholeText.slice(sp ? sp : 0, ep)
                .replace(/[\r\n]+/mg, '')
                .replace(/\[([^\]=]*)(=[^\]]*)?\]\[\/\1\]/mg, '');
            break;

          default:
            console.warn('Unhandled tag ' + e.tagName);
        }
      }
      return tmp;
    }

    function quote(user, elm) {
      if (bbetext === null) {
        console.error('bbEditor text box not found!');
        return;
      }
      var post_id;
      var pid = elm.id.match(/^POST([0-9]+)$/);
      if (pid !== null)
        post_id = pid[1];

      var sel = getSelection();
      if (sel.rangeCount > 0) {
        sel = sel.getRangeAt(0);
        if (sel.collapsed || !sel.intersectsNode(elm))
          sel = undefined;
      } else {
        sel = undefined;
      }

      if (bbetext.value.length > 0 &&
          bbetext.value[bbetext.value.length - 1] !== '\n')
        bbetext.value += '\n';
      if (thread_id !== undefined && post_id !== undefined)
        bbetext.value += wrap_tag('url', '/forums/-/t/' + thread_id + '?' +
            post_id, user + ' wrote') + ':\n';
      else
        bbetext.value += user + ' wrote:\n';
      bbetext.value += wrap_tag('quote', '', inner_quote(elm, sel, 0)
          .trim().replace(/[\r\n]{3,}/mg, '\n\n')) + '\n';

      if (bbeeditor)
        bbeeditor.scrollIntoView();

      if (bbeexpand && bbepanel && bbepanel.className &&
          !/\bin\b/.test(bbepanel.className))
        bbeexpand.click();
    }

    var quote_click = handlers.generic({ onclick: function() {
      quote(this.data.getAttribute('data-username'), this.data);
    }});

    return function(elms, func) {
      for (var i = 0; i < elms.length; i++) {
        var elm = elms[i].content_elm;
        quote_click(func(elm), elm);
      }
    };
  })();

  if (!ftl.mobile) {
    var replace_quotebtn = function(elm) {
      // Ugh.
      var oldbtn = elm.parentElement.parentElement.parentElement
          .previousElementSibling.firstElementChild.lastElementChild
          .firstElementChild;
      var newbtn = document.createElement('a');
      newbtn.innerHTML = 'quote/reply';
      newbtn.href = 'javascript:void(0)';
      oldbtn.parentElement.insertBefore(newbtn, oldbtn);
      oldbtn.remove();
      return newbtn;
    };

    block.watch('late', function() {
      fix_quote_btns(posts, replace_quotebtn);
    });
  } else { // mobile
    var replace_quotebtn_m = function(elm) {
      // Ugh.
      var oldbtn = elm.parentElement.firstElementChild.lastElementChild
          .lastElementChild.firstElementChild;
      var newbtn = document.createElement('a');
      newbtn.innerHTML = oldbtn.innerHTML;
      newbtn.href = 'javascript:void(0)';
      newbtn.tabindex = '-1';
      newbtn.role = 'menuitem';
      oldbtn.parentElement.insertBefore(newbtn, oldbtn);
      oldbtn.remove();
      return newbtn;
    };

    block.watch('late', function() {
      fix_quote_btns(posts, replace_quotebtn_m);

      // Add a link to forum settings to allow ignorelist management
      // Ugh.  There's no semi-robust way to select this.
      var li = document.querySelector('ul.nav:nth-child(1)>li:nth-child(3)' +
          '>ul:nth-child(2)>li:nth-child(8)');
      if (li !== null) {
        var new_li = document.createElement('li');
        new_li.innerHTML = '<a title="Forum Settings" ' +
            'href="https://www.fasttech.com/forums/settings">' +
            'Forum Settings</a>';
        li.parentElement.insertBefore(new_li, li);
      }
    });
  }
}

if (ftl.thread && ftl.mobile) {
  // Fix up YT iframe size: CSS doesn't work well here.
  var fr_resize = (function() {
    var frs;
    var raf;
    function do_resize() {
      for (var i = 0; i < frs.length; i++) {
        var fr = frs[i];
        fr.elm.style.height = Math.ceil(fr.elm.clientWidth * fr.ar) + 'px';
      }

      raf = undefined;
    }
    return function(fr) {
      if (frs === undefined) {
        frs = [];
        window.addEventListener('resize', function() {
          if (raf === undefined)
            raf = requestAnimationFrame(do_resize);
        });
      }
      fr.style.maxWidth = fr.width + 'px';
      fr.style.width = '100%';
      frs.push({elm: fr, ar: fr.height / fr.width});
    };
  })();

  block.watch('ready', function() {
    var frs = document.getElementsByTagName('iframe');
    for (var i = 0; i < frs.length; i++)
      fr_resize(frs[i]);
  });
}
if (ftl.thread && !ftl.perma) {
  var scroll_to_hash = function() {
    function scroll(elm) {
      if (elm) {
        var sd = elm.style.display;
        elm.style.display = '';
        elm.scrollIntoView();
        elm.style.display = sd;
      }
    }
    if (location.hash === '#unread' || location.hash === '#last')
      last_viewed.get(thread_id, function(hash, lvp, lpn, lp) {
        block.watch('filter', function() {
          var i;
          var pid = 'POST' + lp;
          for (i = posts.length - 1; i >= 0; i--) {
            if (posts[i].content_elm.id === pid)
              break;
          }
          if (i < posts.length - 1)
            scroll(posts[i + 1].post_elms[0]);
          else if (hash === '#last')
            scroll(posts[posts.length - 1].post_elms[0]);
        });
      }, location.hash);
    else if (location.hash !== '')
      block.watch('filter', function() {
        scroll(document.getElementById(location.hash));
      });
    // Drop the hash so we won't run again
    history.replaceState(history.state, '', location.pathname);
  };
}

if (ftl.threadlist) {
  if (!ftl.mobile) {
    var add_last_viewed =
        function(elm, last_viewed_page, last_post_nr, last_post_id) {
      var row = elm.parentElement;
      var pelm = row.parentElement.getElementsByClassName('Pager')[0];
      var p = parse_pager(pelm);
      var skip_margin = false;

      if (pelm === undefined) {
        skip_margin = true;
        if (!ftl.settings) {
          pelm = document.createElement('div');
          pelm.className = 'Pager';
          row.appendChild(pelm);
        } else {
          pelm = row.parentElement.appendChild(document.createElement('div'));
          pelm.className = 'Pager';
        }
      }

      if (settings.get('track_viewed')) {
        var lv = document.createElement('a');
        lv.href = gen_page_link(elm.href, last_viewed_page);
        lv.innerHTML = 'Last viewed';
        lv.className = 'FormButton blue';
        if (!skip_margin)
          lv.style.marginLeft = '5px';
        pelm.appendChild(lv);
        skip_margin = false;
      }

      var tr = row.parentElement.parentElement;
      var ts = tr.getElementsByClassName('ThreadStats')[0];
      var pc;
      if (ts !== undefined)
        pc = (pc = ts.innerHTML.match(/Replies: ([0-9]+)/)) ?
            parseInt(pc[1]) : undefined;
      var unread = pc > 0 && pc >= last_post_nr;
      if ((unread || settings.get('always_unread')) &&
          settings.get('track_posts')) {
        var np = document.createElement('a');
        if (unread) {
          np.innerHTML = 'Unread posts';
          np.className = 'FormButton red';
          np.href = gen_page_link(elm.href,
              postnr_to_pagenr(last_post_nr, p.last), 'unread');
        } else {
          np.innerHTML = 'No unread posts';
          np.className = 'FormButton white';
          np.href = gen_page_link(elm.href,
              postnr_to_pagenr(last_post_nr, p.last), 'last');
        }
        if (!skip_margin)
          np.style.marginLeft = '5px';
        pelm.appendChild(np);
        skip_margin = false;
      }
    };

    var mangle_list = function() {
      var header = document.getElementsByClassName('ForumHeader')[0];
      var filter = !ftl.settings && !ftl.author && settings.get('hide_threads');
      var sku_re = new RegExp('fasttechcdn.com/[0-9]+/([0-9]+)/.*');
      var author_re = new RegExp('started\\W+by\\W+(\\w+)');
      if (header !== undefined) {
        var ch = header.parentElement.children;
        for (var i = 1; i < ch.length; i += 2) {
          var tr = ch[i];
          var tl = tr.getElementsByClassName('ThreadLink')[0];
          var tid;
          if (tl !== undefined &&
              (settings.get('track_posts') || settings.get('track_viewed'))) {
            tid = parseInt(tl.href.match(thread_id_re)[1]);
            if (!isNaN(tid))
              last_viewed.get(tid, add_last_viewed, tl);
          }
          var img = tr.firstElementChild.firstElementChild;
          if (img && img.tagName === 'IMG') {
            var sku = img.src.match(sku_re);
            if (sku !== null) {
              var p = img.parentElement;
              var a = document.createElement('a');
              a.href = '/products/' + sku[1];
              a.appendChild(img);
              p.appendChild(a);
            }
          }
          if (filter) {
            var u = tl.parentElement.textContent
                .match(author_re);
            if (u && u[1] && ignore_list.get(u[1])) {
              tr.style.display = 'none';
              if (tr.previousElementSibling !== header)
                tr.previousElementSibling.style.display = 'none';
            }
          }
        }
      }
    };

    block.watch('ready', mangle_list);
  } else { // mobile
    var add_last_viewed =
        function(elm, last_viewed_page, last_post_nr, last_post_id) {
      var rh = elm.parentElement;
      var tr = rh.parentElement;
      var p = parse_pager(tr.getElementsByClassName('pagination')[0]);
      var d = document.createElement('div');
      d.style.marginLeft = '-5px';

      if (settings.get('track_viewed')) {
        var lv = document.createElement('span');
        lv.innerHTML = '<a href="' +
            gen_page_link(elm.href, last_viewed_page) + '">Last viewed</a>';
        lv.className = 'btn btn-default';
        lv.style.margin = '5px';
        d.appendChild(lv);
      }

      var pc = (pc = tr.textContent.match(/R(eplies)?: ([0-9]+)/)) ?
          parseInt(pc[2]) : undefined;
      var unread = pc > 0 && pc >= last_post_nr;
      if ((unread || settings.get('always_unread')) &&
          settings.get('track_posts')) {
        var np = document.createElement('span');
        np.className = 'btn btn-default';
        np.style.margin = '5px';
        var npa = document.createElement('a');
        if (unread) {
          npa.innerHTML = 'Unread posts';
          npa.href = gen_page_link(elm.href,
              postnr_to_pagenr(last_post_nr, p.last), 'unread');
          npa.style.color = '#C64148';
        } else {
          npa.innerHTML = 'No unread posts';
          npa.style.color = '#888';
          npa.href = gen_page_link(elm.href,
              postnr_to_pagenr(last_post_nr, p.last), 'last');
        }
        np.appendChild(npa);
        d.appendChild(np);
      }

      rh.appendChild(d);
    };

    var mangle_list = function() {
      var filter = settings.get('hide_threads');
      var elms = document.getElementsByClassName('ListRow');
      var author_re = new RegExp('started\\W+by\\W+(\\w+)');
      for (var i = 0; i < elms.length; i++) {
        var elm = elms[i];
        var rh = elm.getElementsByClassName('RowHeading')[0];
        if (rh === undefined)
          continue;
        var l = rh.firstElementChild;
        if (l !== undefined &&
            (settings.get('track_posts') || settings.get('track_viewed'))) {
          var tid = parseInt(l.href.match(thread_id_re)[1]);
          if (!isNaN(tid))
            last_viewed.get(tid, add_last_viewed, l);
        }

        if (filter) {
          var u = rh.parentElement.textContent.match(author_re);
          if (u && u[1] && ignore_list.get(u[1]))
            elm.style.display = 'none';
        }
      }
    };
    block.watch('ready', function() {
      if (ftl.product) {
        // Wait for thread list to load before mangling
        var div = document.getElementById('forum');
        if (div !== null)
          new MutationObserver(function(es, mo) {
            mo.disconnect();
            mangle_list();
          }).observe(div, { childList: true });
      } else {
        mangle_list();
      }
    });
  }
}
if (!ftl.mobile && ftl.thread) {
  var have_itmenu = false;
  var have_itmanage = false;
  var update_itmanage = function(n, itm) {
    if (!have_itmenu)
      return;
    var div = document.getElementById('IgnorelistPopout');
    if (div === null)
      return;

    if (!have_itmanage && itm) {
      var frag = document.createDocumentFragment();
      var hr = document.createElement('hr');
      hr.className = 'itmanage';
      frag.appendChild(hr);

      var l = document.createElement('div');
      l.innerHTML = '<b>Ignored Users</b>';
      l.className = 'itmanage';
      l.style.marginTop = '10px';
      manage_menu.register(l);
      l.getElementsByClassName('il_addbtn')[0].className = 'FormButton blue';
      frag.appendChild(l);
      div.appendChild(frag);
      have_itmanage = true;
    } else if (have_itmanage) {
      var elms = div.getElementsByClassName('itmanage');
      for (var i = 0; i < elms.length; i++)
        elms[i].style.display = itm ? '' : 'none';
    }
  };
  var update_itmenu = function(n, itm) {
    if (!have_itmenu && itm) {
      var b = document.getElementsByClassName('ThreadCommandBar')[0];
      var sp = document.createElement('span');
      sp.id = 'Ignorelist';
      sp.className = 'ThreadCommand';
      sp.innerHTML = 'Settings';
      b.appendChild(sp);

      block.watch('late', function() {
        var div = document.createElement('div');
        div.id = 'IgnorelistPopout';
        div.className = 'PopoutPanel';
        div.align = 'left';
        div.setAttribute('style',
            'position: absolute; background: white; padding: 20px');
        settings_menu.register(div, thread_menu);
        b.appendChild(div);

        PM2({par: 'Ignorelist', dupe: false});

        have_itmenu = true;
        block.watch('late', function() {
          update_itmanage(undefined, settings.get('inthread_manage'));
        });
      });
    } else if (have_itmenu) {
      var elm = document.getElementById('Ignorelist');
      if (elm !== null)
        elm.style.display = itm ? '' : 'none';
    }
  };

  post_filter.watch(gen_watch_filter(function(post) {
    var tbl = post.post_elms[0].parentElement;
    var ph = post.placeholder = document.createElement('tr');
    ph.innerHTML = '<td colspan="2" class="ForumHeader" ' +
        'style="padding: 10px; text-align: center"><a>Post by ' +
        strip_tags(post.user) + ' hidden.  Click to show.</a></td>';
    ph.firstElementChild.firstElementChild.href = 'javascript:void(0)';
    handlers.hide_toggle(ph.firstElementChild.firstElementChild, post);
    tbl.insertBefore(ph, post.post_elms[0]);
    return ph;
  }));
  settings.watch('placeholders', post_filter.update);

  block.watch('ready', function() {
    // Wire posts & ignorebuttons up
    ignore_buttons.set('+ ignore', '+ unignore');
    for (var i = 0; i < posts.length; i++) {
      var post = posts[i];
      var tl = post.content_elm.parentElement.parentElement.parentElement;
      post.post_elms = [tl.previousElementSibling, tl];
      var head = tl.previousElementSibling.firstElementChild.lastElementChild;
      var new_a = document.createElement('a');
      new_a.href = 'javascript:void(0)';
      head.appendChild(new_a);
      post.ignbtn = new_a;
      post.badge = tl.getElementsByClassName('Badges')[0];
    }
    post_filter.register(posts);
    ignore_buttons.register(posts);
    user_tags.register(posts);

    settings.watch('inthread_manage', update_itmanage);
    settings.watch('inthread_menu', update_itmenu);
  });

  block.watch('late', function() {
    var p = parse_pager(document.getElementsByClassName('Pager')[1]);
    var lpn = (p.cur - 1) * 10 + posts.length;
    var lp = parseInt(posts[posts.length - 1].content_elm.id.slice(4));
    if (!ftl.perma)
      last_viewed.set(thread_id, p.cur, lpn, lp);
  });

  if (!ftl.perma && thread_id !== undefined) {
    if (location.hash !== '')
      scroll_to_hash();
  }
}
if (ftl.mobile && ftl.thread) {
  post_filter.watch(gen_watch_filter(function(post) {
    var tbl = post.post_elms[0].parentElement;
    var ph = post.placeholder = document.createElement('div');
    ph.className = 'col-xs-12 ListRow';
    ph.style.paddingBottom = '5px';
    ph.style.textAlign = 'center';
    ph.innerHTML = '<a>Post by ' + strip_tags(post.user) +
        ' hidden.  Click to show.</a>';
    ph.firstElementChild.href = 'javascript:void(0)';
    handlers.hide_toggle(ph.firstElementChild, post);
    tbl.insertBefore(ph, post.post_elms[0]);
    return ph;
  }));
  settings.watch('placeholders', post_filter.update);

  ignore_buttons.set(' Ignore', ' Unignore');

  var have_itmenu = false;
  var have_itmanage = false;
  var update_itmanage = function(n, itm) {
    if (!have_itmenu)
      return;
    var menu = document.getElementById('hideSettings');
    if (menu === null)
      return;
    if (!have_itmanage && itm) {
      var frag = document.createDocumentFragment();
      var inner = menu.getElementsByClassName('panel-body')[0];
      var hr = document.createElement('hr');
      hr.className = 'itmanage';
      frag.appendChild(hr);
      var l = document.createElement('div');
      l.className = 'itmanage';
      l.innerHTML = '<b>Ignored Users</b>';
      l.style.marginTop = '10px';
      manage_menu.register(l);
      l.getElementsByClassName('il_addbtn')[0].remove();
      frag.appendChild(l);
      inner.appendChild(frag);
      have_itmanage = true;
    } else if (have_itmanage) {
      var elms = menu.getElementsByClassName('itmanage');
      for (var i = 0; i < elms.length; i++)
        elms[i].style.display = itm ? '' : 'none';
    }
  };
  var update_itmenu = function(n, itm) {
    if (!have_itmenu && itm) {
      var div = document.createElement('div');
      div.id = 'itmenu';
      div.className = 'panel panel-default';
      div.innerHTML = '<div class="panel-heading"><h5 class="panel-title">' +
          '<a href="#hideSettings" data-toggle="collapse">Settings ' +
          '<span class="caret"></span></a></h5>' +
          '<div id="hideSettings" class="panel-collapse collapse">' +
          '<div class="panel-body"></div></div>';
      block.watch('late', function() {
        var inner = div.getElementsByClassName('panel-body')[0];
        settings_menu.register(inner, thread_menu);
        document.getElementsByClassName('body-content')[0].appendChild(div);

        have_itmenu = true;
        if (settings.get('inthread_manage') !== undefined)
          update_itmanage(undefined, settings.get('inthread_manage'));
      });
    } else if (have_itmenu) {
      document.getElementById('itmenu').style.display = itm ? '' : 'none';
    }
  };

  block.watch('ready', function() {
    for (var i = 0; i < posts.length; i++) {
      var post = posts[i];
      var pe = post.content_elm.parentElement;
      post.post_elms = [pe];
      var menu = pe.firstElementChild.lastElementChild;

      var li = document.createElement('li');
      li.setAttribute('role', 'presentation');
      li.innerHTML = '<a tabindex="-1" role="menuitem">' +
          '<span class="glyphicon glyphicon-plus red"></span><span></span></a>';
      li.firstElementChild.href = 'javascript:void(0)';
      var rp = menu.lastElementChild;
      if (!rp.firstElementChild.lastChild.data.startsWith(' Report'))
        rp = rp.previousElementSibling;
      menu.insertBefore(li, rp);
      post.ignbtn = li.firstElementChild.lastElementChild;

      var badge = menu.firstElementChild.firstElementChild;
      var m = badge.innerHTML.match(/(.*)\((.*)\)/);
      badge.innerHTML = m[1] + '(<span>' + m[2] + '</span>)';
      post.badge = badge.lastElementChild;
    }
    post_filter.register(posts);
    ignore_buttons.register(posts);
    user_tags.register(posts);

    settings.watch('inthread_manage', update_itmanage);
    settings.watch('inthread_menu', update_itmenu);
  });

  block.watch('late', function() {
    var p = parse_pager(document.getElementsByClassName('pagination')[0]);
    var lpn = (p.cur - 1) * 10 + posts.length;
    var lp = parseInt(posts[posts.length - 1].content_elm.id.slice(4));
    if (!ftl.perma)
      last_viewed.set(thread_id, p.cur, lpn, lp);
  });

  if (!ftl.perma && thread_id !== undefined) {
    if (location.hash !== '')
      scroll_to_hash();
  }
}
if (ftl.new_arrivals) {
  var product_filter = (function() {
    var items;

    function update() {
      if (items === undefined)
        return;

      for (var i = 0; i < items.length; i++) {
        items[i].content_elm.style.display =
            ignore_categories.get(items[i].category) ? 'none' : '';
      }
    }

    return {
      register: function(list) {
        items = list;
        ignore_categories.watch('late', update);
      },
    };
  })();

  var catnr_re = new RegExp('categor(y|ies)/([0-9]+)/');
  var catstr_re = new RegExp('\\bf=([a-zA-Z0-9]+)');
  var catstr_cleanup_re = new RegExp('^.*=([0-9]+)$');
  var ignore_category = function(elm, cat) {
    elm.addEventListener('click', function() { ignore_categories.set(cat); });
    ignore_categories.watch('late', function(c, s) {
      if (c === cat)
        elm.checked = !s;
    });
    elm.checked = !ignore_categories.get(cat);
  };
  var add_ign_cb = function(elm) {
    try {
      var cat = atob(elm.lastElementChild.href.match(catstr_re)[1])
          .match(catstr_cleanup_re)[1];

      var cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.style.float = 'right';
      cb.style.margin = '2px -2px 0px -11px';
      ignore_category(cb, cat);
      elm.insertBefore(cb, elm.firstElementChild);
    } catch (e) {}
  };

  block.watch('ready', function() {
    var container = ftl.mobile ?
        document.getElementsByClassName('ProductsGrid')[0] :
        document.getElementById('Products_Grid');
    if (container === null || container === undefined)
      return;

    var list = [];
    for (var elm = container.firstElementChild; elm !== null;
        elm = elm.nextElementSibling) {
      try {
        var cat = elm.lastElementChild.lastElementChild.firstElementChild.href
            .match(catnr_re)[2];
        list.push({ content_elm: elm, category: cat });
      } catch (e) {}
    }
    product_filter.register(list);

    var cats, i;
    if (ftl.mobile) {
      var heads = document.getElementsByClassName('panel-heading');
      for (i = 0; i < heads.length; i++) {
        if (heads[i].textContent.trim() === 'Category') {
          cats = heads[i];
          break;
        }
      }
      if (cats === undefined)
        return;

      cats = cats.parentElement.lastElementChild.firstElementChild;
      while (cats !== null) {
        add_ign_cb(cats.lastElementChild);
        cats = cats.nextElementSibling;
      }
    } else {
      var groups = document.getElementsByClassName('FilterGroup');

      for (i = 0; i < groups.length; i++) {
        if (groups[i].textContent.trim() === 'Category') {
          cats = groups[i];
          break;
        }
      }
      if (cats === undefined)
        return;

      cats = cats.nextElementSibling;
      while (cats !== null && cats.classList.contains('FilterEntry')) {
        add_ign_cb(cats);
        cats = cats.nextElementSibling;
      }
    }
  });
}
// Mobile reviews don't show tags
if (ftl.reviews && !ftl.mobile) {
  var reg_tags = function(badges) {
    var posts = [];
    for (var i in badges) {
      var badge = badges[i];
      if (badge.innerText === '' ||
          !badge.previousElementSibling ||
          badge.previousElementSibling.className !== 'Nickname')
        continue;
      posts.push({
        user: badge.previousElementSibling.innerText.trim(),
        badge: badge,
      });
    }
    if (posts.length !== 0)
      user_tags.register(posts);
  };

  block.watch('ready', function() {
    var badges = document.getElementsByClassName('Badges');
    if (badges.length !== 0) {
      reg_tags(badges);
    } else {
      var elm;
      if (!ftl.mobile)
        elm = document.getElementById('Reviews-tab');
      else
        elm = document.getElementById('reviews');
      if (elm !== null) {
        new MutationObserver(function(es, mo) {
          mo.disconnect();
          reg_tags(document.getElementsByClassName('Badges'));
        }).observe(elm, { childlist: true });
      }
    }
  });
}
if (!ftl.mobile) {
  if (ftl.prsearch) {
    var search = location.href.match(/\/search(\/([0-9]+)?-?(.*))?\?([^&]+)/);
    if (search !== null) {
      if (!search[2])
        search[2] = '0';
      var sortcookie = document.cookie.match(/\bsort=([a-zA-Z0-9]+)/);
      sortcookie = sortcookie ? sortcookie[1] : 'r';
      location.replace(location.origin +
            '/category/' + search[2] + '/search/-/p/0?f=-&keywords=' + search[4] +
            '&sort=' + sortcookie);
    }
  }

  if (ftl.prcategory && location.search) {
    block.watch('ready', function() {
      var sortelm = document.getElementById('content_SortOrder');
      if (sortelm) {
        sortelm.onchange = function() {
          document.cookie = 'sort=' + this.value + ';path=/';
          location.href = location.href.replace(/\bsort=[^&]*/, '') +
              '&sort=' + this.value;
        };
      }

      var searchcat = document.getElementById('searchBarCategory');
      var urlcat = location.search.match(/\bf=([a-zA-Z0-9]+)/);
      if (searchcat !== null && urlcat !== null) {
        searchcat.value = atob(urlcat[1]).replace(/^.*=/, '');
        if (!searchcat.value)
          searchcat.value = '';
      }
    });
  }
} else {
  if (ftl.prsearch) {
    var search = location.href.match(/\/search\/([0-9]+).*\?(.*)/);
    if (search !== null) {
      var sortcookie = document.cookie.match(/\bsort=([a-zA-Z0-9]+)/);
      sortcookie = sortcookie ? sortcookie[1] : '0';
      location.replace(location.origin +
          '/c/' + search[1] + '/-/-/p/0?f=-&sort=' + sortcookie +
          '&' + search[2]);
    }
  }

  if (ftl.prcategory) {
      var fix_onclick = function(elm, sortnr) {
        elm.onclick = function() {
          document.cookie = 'sort=' + sortnr + ';path=/';
          location.href = location.href.replace(/\bsort=[^&]*/, '') +
              '&sort=' + sortnr;
        };
      };

      block.watch('ready', function () {
        try {
          var li = document.querySelector('.clearfix button .glyphicon-sort')
              .parentElement.parentElement.lastElementChild.firstElementChild;
          for ( ; li !== null; li = li.nextElementSibling) {
            console.log(li);
            var inner = li.firstElementChild;
            var sortnr = String.match(inner.onclick, /\bsort=([0-9]+)/);
            if (sortnr === null)
              continue;
            fix_onclick(inner, sortnr[1]);
          }
        } catch (e) {}
      });
  }
}
if (ftl.settings) {
  block.watch('ready', function() {
    var panel = document.getElementsByClassName('PageContentPanel')[0];
    var div = document.createElement('div');
    div.style.marginTop = '5px';
    div.innerHTML = '<table style="width: auto"><tbody><tr><td class="MediumL' +
        'abel Bold EndOfInlineSection" style="padding: 5px">Ignored Users</td' +
        '><td width=15></td><td class="MediumLabel Bold EndOfInlineSection" s' +
        'tyle="padding: 5px">FastTech Forum Enhancements Settings</td></tr><t' +
        'r><td style="padding: 0px"><div class="BGShadow" style="padding: 10p' +
        'x"></div></td><td width=15></td><td style="padding:10px"><div class=' +
        '"BGShadow" style="padding: 0px"></div></td></tr></tbody></table>';

    var divs = div.getElementsByTagName('div');
    settings_menu.register(divs[1], full_menus);
    manage_menu.register(divs[0]);
    divs[0].getElementsByClassName('il_addbtn')[0].className =
        'FormButton blue';
    panel.appendChild(div);
  });
}
