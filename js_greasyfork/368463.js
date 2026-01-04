// ==UserScript==
// @name         Fixdit for Reddit Redesign
// @namespace    http://tampermonkey.net/
// @version      0.7.4.2
// @description  UX enhancements for Reddit's 2018 redesign: filters, collapse child comments, subreddit info...
// @author       scriptpost (u/postpics)
// @match        https://www.reddit.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.slim.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/368463/Fixdit%20for%20Reddit%20Redesign.user.js
// @updateURL https://update.greasyfork.org/scripts/368463/Fixdit%20for%20Reddit%20Redesign.meta.js
// ==/UserScript==
(function ($, undefined) {
  $(function () {
    const GetElById = document.getElementById.bind(document);
    const GetElsByClass = document.getElementsByClassName.bind(document);
    const GetElsByName = document.getElementsByName.bind(document);
    const GetEl = document.querySelector.bind(document);
    const GetEls = document.querySelectorAll.bind(document);
    const GetStyle = (e, p, v) => window.getComputedStyle.bind(window, [e, p]).getPropertyValue(v);

    if (!GetElById('SHORTCUT_FOCUSABLE_DIV')) return; // probably using old site.

    const _stylesheet = String.raw`<style type="text/css" id="fixdit">#fixd_settings em,.fixd_filter_msg em{font-style:italic}.fixd_filter_msg button:hover,button.fixd_collapse:hover,button.fixd_collapse_all:hover{text-decoration:underline}#fixd_launch{box-sizing:border-box;position:fixed;top:2px;right:2px;width:24px;height:24px;z-index:100;text-align:center;border-radius:50%;border:2px solid hsla(70,0%,100%,.5);border-left-color:hsla(70,0%,0%,1);border-right-color:hsla(70,0%,0%,1);background:0 0;cursor:pointer;-moz-user-select:none;user-select:none}#fixd_launch.fixd_active{border-color:hsla(70,0%,100%,.5);border-top-color:hsla(70,0%,0%,1);border-bottom-color:hsla(70,0%,0%,1)}#fixd_launch:not(.fixd_active):hover:before{content:"Fixdit settings...";display:inline-block;padding:6px 12px;font-size:80%;color:#fff;position:absolute;right:calc(100% + 12px);white-space:nowrap;background:hsla(0,0%,0%,.8);border-radius:2px;pointer-events:none}#fixd_settings{position:fixed;top:0;right:0;opacity:0;z-index:101;padding:24px 12px;background:hsla(180,2%,90%,.95);border-radius:3px;box-shadow:0 5px 10px hsla(0,0%,0%,.25),0 0 3px hsla(0,0%,0%,.25);font-size:80%;width:300px;visibility:hidden;overflow:hidden;transition:visibility .2s,height .2s,bottom .2s,left .2s,top .2s,right .2s,opacity .2s}#fixd_settings.fixd_active{visibility:visible;opacity:1;top:5px;right:24px}.fixd_list_area+div,.fixd_static_header .fixd_overlay_head,.fixd_static_header .fixd_overlay_head+div{top:0}#fixd_settings.fixd_expanded{bottom:5px}body.fixd_debug #fixd_settings:after{display:block;margin-top:4px;content:"Version " attr(data-version);text-align:right;font-size:12px;color:#7f7f7f}.fixd_description{line-height:1.5;margin:-8px -12px 0;padding:8px}#fixd_settings h2,#fixd_settings h3{display:inline-block;margin-bottom:10px;vertical-align:middle}#fixd_settings strong{font-weight:700}#fixd_settings h1{font-size:140%;font-weight:400;margin:0 0 .5em}#fixd_settings h2{font-size:120%;font-weight:400}#fixd_settings h3{font-size:100%;font-weight:400}#fixd_settings h3 span{display:block;margin-top:4px;font-size:120%}#fixd_settings .fixd_option,#fixd_settings .fixd_option_btn,#fixd_settings .fixd_option_select,#fixd_settings .fixd_switch{display:block;margin:1px -12px 0;cursor:default;-moz-user-select:none;user-select:none;background:#f3f0f0}#fixd_settings .fixd_option_select input,#fixd_settings .fixd_switch input{vertical-align:middle}#fixd_settings .fixd_option_btn{margin:1px -12px;cursor:default}#fixd_settings .fixd_option_btn:after{content:" >";color:#999;font-weight:700;float:right}#fixd_settings .fixd_option_btn:hover:after{color:#000}#fixd_settings .fixd_option_btn:hover,#fixd_settings .fixd_setting:hover{outline:hsla(0,0%,0%,.3) solid 1px}#fixd_settings .fixd_option_btn,#fixd_settings .fixd_option_select,#fixd_settings .fixd_switch{padding:10px 16px}#fixd_settings .fixd_enabled{background:#fff}#fixd_settings .fixd_switch:not(.fixd_option){font-size:120%;margin-bottom:8px;background:#f3f0f0}#fixd_settings .fixd_switch.fixd_enabled:not(.fixd_option){color:#000;background:#fff}#fixd_settings .fixd_option span{padding-left:.3em}#fixd_dialog{position:absolute;top:0;left:0;right:0;bottom:0;padding:24px 12px 8px;border-radius:4px;background:#e4e6e6;display:flex;flex-direction:column}#fixd_dialog textarea{box-sizing:border-box;min-width:100%;max-width:100%;min-height:50px;max-height:100%;border:1px solid #fff;flex:1}.fixd_settings_buttons{text-align:right;margin:6px 0}.fixd_btn_back,.fixd_btn_save{text-transform:uppercase;border:1px solid transparent;border-radius:2px;vertical-align:middle}.fixd_btn_back{font-weight:700;color:transparent;margin-right:12px;padding:0;overflow:hidden;width:30px;height:30px;line-height:30px;margin-bottom:10px;border:1px solid #ccc;background:0 0}.fixd_btn_back:hover{border:1px solid #666}.fixd_btn_back:before{color:#000;content:"< "}.fixd_btn_save{color:#fff;padding:8px 24px;background:#0076b2;cursor:pointer}.fixd_btn_save:hover{background-color:#0087cc}button.fixd_collapse,button.fixd_collapse_all{cursor:pointer;color:inherit;display:inline-block;background:0 0;outline:0;font-size:12px;font-weight:700}a+button.fixd_collapse{margin-left:10px}button.fixd_collapse_all{margin-left:20px;color:#a6a4a4;font-size:12px;font-weight:700;text-transform:uppercase}button.fixd_collapse:before,button.fixd_collapse_all:before{content:"Hide "}button.fixd_collapse:after,button.fixd_collapse_all:after{content:" <<"}button.fixd_collapse.fixd_active:before,button.fixd_collapse_all.fixd_active:before{content:"Show "}button.fixd_collapse.fixd_active:after,button.fixd_collapse_all.fixd_active:after{content:" >"}.fixd_popup{box-sizing:border-box;position:absolute;z-index:100;padding:12px;font-size:12px;border-radius:4px;border-top:4px solid #c1cfd6;color:#1c1c1c;background-color:#fff;box-shadow:rgba(0,0,0,.2) 0 1px 3px;overflow:hidden}#fixd_popup_subreddit.fixd_subscriber{border-top-color:#0076d1}.fixd_popup>div{float:left}.fixd_popup>div:nth-of-type(2){width:200px;margin-left:12px;padding-left:12px;border-left:1px solid #edeff1}.fixd_popup .fixd_popup_subs span,.fixd_popup h2{display:block;font-size:16px;font-weight:500;line-height:20px}.fixd_filtered .Comment,.fixd_no_blank .icon-outboundLink,.fixd_popup:not(.fixd_filterable) .fixd_popup_filter,.fixd_unfiltered .fixd_filter_msg{display:none}.fixd_popup .fixd_popup_created,.fixd_popup .fixd_popup_subs{font-weight:500}.fixd_popup .fixd_popup_subs{margin-top:12px}.fixd_popup h2:before{content:"r/"}.fixd_popup .fixd_popup_subtitle{margin-bottom:.5em;color:#7f7f7f}.fixd_popup .fixd_popup_desc{color:#7f7f7f;line-height:1.2}.fixd_popup .fixd_popup_desc,.fixd_popup .fixd_popup_title{margin:0 0 .5em}.fixd_popup_filter{font-size:12px;text-transform:uppercase;padding:8px 12px;margin-top:12px;border-radius:2px;color:#fff;border:1px solid transparent;background:#0076d1;cursor:pointer}.fixd_popup_filter.fixd_active{color:#0076d1;border:1px solid;background:#fff}.fixd_popup_filter.fixd_active:before{content:"un"}.fixd_tooltip{pointer-events:none}body:not(.fixd_debug) .fixd_hidden{visibility:hidden;position:absolute}.fixd_debug .fixd_hidden{opacity:.6}.fixd_debug .fixd_filtered{outline:#dc143c solid 1px}.fixd_debug .fixd_unfiltered{outline:green solid 1px}.fixd_filter_msg{font-size:12px;color:#878a8c}.fixd_filter_msg button{content:"Show comment";color:inherit;background:0 0;cursor:pointer;margin:12px 0 0 12px}.fixd_override_vote_icon>div{color:inherit!important}button.fixd_no_icon[data-click-id=upvote],button.fixd_no_icon[data-click-id=downvote]{background-image:none!important}button.fixd_no_icon[data-click-id=upvote][aria-pressed=true]{color:#f40!important}button.fixd_no_icon[data-click-id=downvote][aria-pressed=true]{color:#7091ff!important}button.fixd_no_icon[data-click-id=upvote]:hover{color:#cc3600}button.fixd_no_icon[data-click-id=downvote]:hover{color:#5b75cc}button.fixd_no_icon[data-click-id=upvote]:before,button.fixd_no_icon[data-click-id=downvote]:before{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;font-family:redesignFont}button.fixd_no_icon[data-click-id=upvote]:before{content:"\F130"}button.fixd_no_icon[data-click-id=downvote]:before{content:"\F109"}body.fixd_reduce_comment_spacing .Comment.top-level{margin-top:0}.fixd_debug .fixd_no_blank{outline:#00f solid 1px}body.fixd_visited_links .Comment p a:visited,body.fixd_visited_links .Comment span>a:visited,body.fixd_visited_links .Post p a:visited,body.fixd_visited_links .Post span>a:visited{color:purple}.fixd_debug[data-fixd-view=compact] .fixd_list_area .Post>div>div:nth-of-type(2)>div>div:first-child{background-color:#c1e0fe}.fixd_expando_hitbox[data-fixd-view=compact] .fixd_list_area .Post>div>div:nth-of-type(2)>div>div:first-child{margin:0 8px}.fixd_expando_hitbox[data-fixd-view=compact] .fixd_list_area .Post>div>div:nth-of-type(2)>div>div:first-child button{margin:0}.fixd_debug #lightbox{margin:0 200px;width:auto}.fixd_debug #overlayFixedContent+div+div{background-color:rgba(0,0,0,.5)}.fixd_debug .fixd_observed:before{content:"o";position:absolute;z-index:100;padding:1px 3px;color:#fff;font-size:12px;border:2px solid hsla(0,0%,100%,.2);background:hsla(0,0%,0%,.5);pointer-events:none}.fixd_static_header header{position:absolute;z-index:40}</style>`;
    document.body.insertAdjacentHTML('beforeend', _stylesheet);

    // TODO: (current issues)
    // Add observer to hidden comments.
    // Observer for switching from comment permalink to all comments.
    // Use typescript.

    // CHANGELOG: (latest)
    // Apply 'static header' in overlay window.

    // Utils:
    const UT = {
      format_date: {
        age(date) {
          date = new Date(date).valueOf();
          const difference = new Date(new Date().valueOf() - date);
          let y = parseInt(difference.toISOString().slice(0, 4), 10) - 1970;
          let m = difference.getMonth() + 0;
          let d = difference.getDate();
          let result;
          if (y > 0) result = (y === 1) ? y + ' year' : y + ' years';
          else if (m > 0) result = (m === 1) ? m + ' month' : m + ' months';
          else result = (d === 1) ? d + ' day' : d + ' days';
          return result;
        }
      },
      get_post_author_link(node) {
        if (!node) return;
        const region = node.querySelector('div[data-click-id="body"]');
        let links;
        if (region) {
          links = region.getElementsByTagName('a');
          for (const link of links) {
            if (!link.innerText.startsWith('u/')) continue;
            const href = link.getAttribute('href');
            if (href && href.startsWith('/user/')) {
              return link;
            }
          }
        }
      },
      page_type() {
        const pages = {
          'profile': () => {
            return !!GetElById('profile-nav-menu-tooltip');
          },
          'search': () => {
            return !!GetElById('search-results-sort');
          },
          'listing': () => {
            return !!GetElById('ListingSort--SortPicker');
          },
          'comments': () => {
            return !!GetElById('CommentSort--SortPicker');
          }
        };
        const result = [...arguments].map((arg) => {
          return pages[arg]();
        });
        return result.includes(true);
      },
      node_text_includes(str, node) {
        const child = (node) ? node.firstChild : undefined;
        if (child && child.nodeValue) {
          return child.nodeValue.includes(str);
        }
      },
      get_els_by_text(str, tag, region) {
        const tags = region.getElementsByTagName(tag);
        let result = [];
        for (let i = 0; i < tags.length; i++) {
          if (UT.node_text_includes(str, tags[i])) {
            result.push(tags[i]);
          }
        }
        return result;
      },
      nth_parent(node, n) {
        if (!Number.isInteger(n) && n < 1) throw "First argument must be a positive integer";
        let parent = node;
        if (!parent) return;
        for (let i = 0; i < n; i++) {
          parent = parent.parentNode;
        }
        return parent;
      },
      list_has(list, query, ignore_case) {
        if (!query) return false;
        if (ignore_case) {
          list = list.map(i => i.toUpperCase());
          query = query.toUpperCase();
        }
        return list.includes(query);
      },
      comment_count(region) {
        // TBDL: interpret abbreviated numbers.
        const icon = region.querySelector('.icon-comment');
        if (icon && icon.nextElementSibling) {
          const num = parseInt(icon.nextElementSibling.innerText, 10);
          return !isNaN(num) ? num : 0;
        } else {
          return -1;
        }
      },
      hide(node) {
        if (!node) return;
        node.style.display = 'none';
      },
      show(node) {
        if (!node) return;
        const initial = window.getComputedStyle(node).getPropertyValue('display');
        if (initial === 'none') node.style.display = '';
      }
    };

    class Feature {
      constructor(data) {
        const loaded = JSON.parse(GM_getValue('features', '{}'));

        if (loaded.hasOwnProperty(data.id)) {
          data.enabled = loaded[data.id].enabled;
          if (loaded[data.id].hasOwnProperty('options')) {
            this.loaded_options = loaded[data.id].options;
          }
        }
        else {
          const db_entry = loaded;

          db_entry[data.id] = {
            enabled: data.enabled,
            options: {}
          };

          GM_setValue('features', JSON.stringify(db_entry));
        }

        for (const key in data) {
          this[key] = data[key];
        }
        if (!data.hidden) {
          draw_setting(data);
        }
        this.options = {};
        this.option_callbacks = {};
        this.public = {};
      }

      add_option(option) {
        const loaded_options = this.loaded_options;
        let is_stored = loaded_options.hasOwnProperty(option.id);
        if (is_stored) {
          // Modify passed object.
          if (option.hasOwnProperty('enabled')) {
            option.enabled = loaded_options[option.id].enabled;
          }
          if (loaded_options[option.id].hasOwnProperty('value')) {
            option.value = loaded_options[option.id].value;
          }
        }
        else {
          const db_entry = JSON.parse(GM_getValue('features', '{}'));
          db_entry[this.id].options[option.id] = {};

          if (option.hasOwnProperty('value')) {
            db_entry[this.id].options[option.id].value = option.value;
          }
          db_entry[this.id].options[option.id].enabled = option.enabled;
          GM_setValue('features', JSON.stringify(db_entry));
        }
        this.options[option.id] = new Option(option);
        // Delete temporary object when we're finished with it:
        if (this.loaded_options.hasOwnProperty(option.id)) {
          delete this.loaded_options[option.id];
        }
      }

      toggle() {
        if (this.callback) this.callback(this.enabled);
        const callbacks = this.option_callbacks;
        // Go through each option cb, sending the value of feature.enabled.
        for (const key in callbacks) {
          callbacks[key](this.enabled);
        }
      }

      set on_toggle(fn) {
        this.callback = fn;
      }

      set on_toggle_option(functions) {
        this.option_callbacks = functions;
      }

      update_nodes(nodes) {
        nodes.forEach(n => {
          n.classList.toggle('fixd_enabled');
        });
      }

      update(data, nodes) {
        this.enabled = data;
        this.toggle();
        if (nodes) this.update_nodes(nodes);
      }

      update_option(data, oid, nodes) {
        this.options[oid].enabled = data;
        const callbacks = this.option_callbacks;
        if (this.enabled && callbacks.hasOwnProperty(oid)) {
          callbacks[oid](data);
        }
        if (nodes) this.update_nodes(nodes);
      }

      update_values(oid, data) {
        this.options[oid].value = data;
      }
    }

    class Option {
      constructor(data) {
        for (const key in data) {
          this[key] = data[key];
        }
      }
    }

    class Reddit_Observer {
      constructor(arg) {
        this.name = arg.name;
        this.target = arg.target;
        if (arg.options) {
          this.options = arg.options;
        } else {
          this.options = { childList: true };
        }
        this.actions = [];
        this.watch(arg.target);
      }
      set any(callback) {
        this.any_basis = callback;
      }
      set added(callback) {
        this.added_basis = callback;
      }
      set removed(callback) {
        this.removed_basis = callback;
      }
      get records() {
        if (this.observer) {
          return this.observer.takeRecords();
        }
      }
      loop_actions(mutation, other) {
        for (let i = 0; i < this.actions.length; i++) {
          this.actions[i](this, mutation, other);
        }
      }
      extend(fn) {
        this.actions.push(fn);
        if (this.target) {
          this.watch();
        }
      }
      watch(newTarget) {
        if (newTarget) {
          this.target = newTarget;
        }
        else if (!this.target) {
          return;
        }
        const self = this;
        function mutation(mutations) {
          for (let i = 0; i < mutations.length; i++) {
            const a = mutations[i].addedNodes;
            const r = mutations[i].removedNodes;
            if (self.added_basis && a.length && a[0].nodeType === Node.ELEMENT_NODE) {
              self.added_basis(self, a[0], mutations[i]);
            }
            else if (self.removed_basis && r.length && r[0].nodeType === Node.ELEMENT_NODE) {
              self.removed_basis(self, r[0], mutations[i]);
            }
            else if (self.any_basis) {
              self.any_basis(self, mutations[i]);
            }
          }
        };
        if (this.observer) {
          this.observer.disconnect();
        }
        this.observer = new MutationObserver(mutation);
        if (this.target.constructor.name !== 'NodeList') {
          this.observer.observe(this.target, this.options);
        }
        else {
          for (const target of this.target) {
            this.observer.observe(target, this.options);
          }
        }
      }
    }
    // Set up pre-defined Observers:
    const Body_Obs = new Reddit_Observer({
      name: 'Body',
      target: document.body
    });
    const View_Obs = new Reddit_Observer({
      name: 'View',
      target: GetEls('#view--layout--FUE button'),
      options: { attributes: true }
    });
    const Content_Obs = new Reddit_Observer({
      name: 'Content area',
      target: GetEl('header').parentNode.nextElementSibling,
      options: { childList: true, subtree: true }
    });
    const Post_Obs = new Reddit_Observer({
      name: 'Post',
      target: GetEl('header').parentNode.parentNode,
      options: { childList: true, subtree: true }
    });
    const Comment_Obs = new Reddit_Observer({
      name: 'Comment',
      target: (() => {
        const c = GetElsByClass('Comment');
        if (c.length) {
          return UT.nth_parent(c[0], 4);
        }
      })()
    });
    const Lb_Obs = new Reddit_Observer({
      name: 'LB',
      target: GetElById('SHORTCUT_FOCUSABLE_DIV').children[0]
    });
    const Lb_Comments_Obs = new Reddit_Observer({
      name: 'LB comments',
      target: GetElById('overlayScrollContainer'),
      options: { childList: true, subtree: true }
    });
    const Lb_TT_Obs = new Reddit_Observer({
      name: 'L-box tooltip',
      target: GetElById('overlayAbsoluteTooltipContent')
    })
    const Side_Obs = new Reddit_Observer({
      name: 'Side',
      target: GetElsByClass('fixd--side')[0],
      options: { childList: true, subtree: true }
    });
    // Handle each mutation:
    function added_to_body(self, node) {
      self.loop_actions(node);
    };
    Body_Obs.added = added_to_body;

    function changed_view(self, mutation) {
      if (mutation.attributeName === 'aria-pressed') {
        const isActive = JSON.parse(mutation.target.attributes['aria-pressed'].value);
        if (isActive) {
          document.body.dataset.fixdView = mutation.target.attributes['aria-label'].value;
        }
      }
    }
    View_Obs.any = changed_view;

    // TBDL: more testing needed to reduce overhead.
    function added_to_list_area(self, node) {
      if (node.classList.contains('Post')) return;
      // TODO: shorten statement:
      if (node.children[0] && node.children[0].children[0] && node.children[0].children[0].classList.contains('Post')) return;

      if (node.getElementsByClassName('Post').length) {
        Side_Obs.watch(GetEl('.fixd--side'));
        Post_Obs.watch();
        View_Obs.watch(GetEls('#view--layout--FUE button'));
        self.loop_actions(node);
      }
    };
    Content_Obs.added = added_to_list_area;

    function added_to_post_list(self, node) {
      if (node.querySelector('.Post') || node.classList.contains('Post')) {
        self.loop_actions(node);
      }
    };
    Post_Obs.added = added_to_post_list;

    function added_to_comment_list(self, node, mutation) {
      if (node.getElementsByClassName('Comment')[0]) {
        self.loop_actions(node, mutation);
      }
    };
    Comment_Obs.added = added_to_comment_list;

    function add_remove_lightbox(self, mutation) {
      if (mutation.addedNodes.length) {
        const node = mutation.addedNodes[0];
        const lb = GetElById('overlayScrollContainer');
        const com_count = UT.comment_count(node);
        const comments = node.getElementsByClassName('Comment');
        if (com_count > -1 && comments.length > 0) {
          // Comments found, and watch for new comments.
          const list = UT.nth_parent(comments[0], 4);
          Comment_Obs.watch(list);
          Lb_Comments_Obs.loop_actions(list); // Run actions of other observer.
        } else if (!comments.length) {
          // watch for preloaded comments.
          Lb_Comments_Obs.watch(lb);
        }
        const side = lb.children[0].children[1];
        if (side) {
          Side_Obs.loop_actions(side);
          self.loop_actions(lb);
        } else {
          // watch for side
          Side_Obs.watch(lb);
        }
        Lb_TT_Obs.watch(GetElById('overlayAbsoluteTooltipContent'));
      } else {
        Lb_Obs.watch();
      }
    };
    Lb_Obs.any = add_remove_lightbox;

    function added_preloaded_comments(self, node, mutation) {
      const comments = self.target.getElementsByClassName('Comment');
      if (comments.length > 0) {
        const list = UT.nth_parent(comments[0], 4);
        if (list.parentNode === node) {
          // Freshly loaded:
          Comment_Obs.watch(list);
          self.loop_actions(list);
        }
      }
    };
    Lb_Comments_Obs.added = added_preloaded_comments;

    function added_lb_tooltip(self, node, mutation) {
      self.loop_actions(node, mutation);
    };
    Lb_TT_Obs.added = added_lb_tooltip;

    function added_to_side(self, node, mutation) {
      const side = self.target.children[0].children[1];
      if (side.parentNode === node) {
        Lb_Obs.loop_actions(self.target);
      }
    };
    Side_Obs.added = added_to_side;

    function get_reddit_data(kind, name) {
      return new Promise(function (resolve, reject) {
        let url;
        const key = kind + '_' + name;
        const cache = JSON.parse(GM_getValue('cache', '{}'));
        let ratelimit = JSON.parse(GM_getValue('ratelimit_get', '{}'));

        if (cache[key]) {
          resolve(cache[key]);
        }
        else if (!ratelimit.remaining || ratelimit.remaining > 150) {
          const req = new XMLHttpRequest();
          url = '/r/' + name + '/about.json';
          req.open('GET', url);

          req.onload = function () {
            if (req.status === 200) {
              const response = JSON.parse(this.response).data;
              let json_data = cache;

              ratelimit = {
                used: this.getResponseHeader('x-ratelimit-used'),
                remaining: this.getResponseHeader('x-ratelimit-remaining'),
                reset: this.getResponseHeader('x-ratelimit-reset')
              };

              json_data[key] = {
                name: response.display_name,
                title: response.title,
                subtitle: response.header_title,
                desc: response.public_description,
                created: response.created,
                subs: response.subscribers,
                subscriber: response.user_is_subscriber
              };

              GM_setValue('ratelimit_get', JSON.stringify(ratelimit));
              GM_setValue('cache', JSON.stringify(json_data));
              resolve(json_data[key]);
            }
            else {
              reject(Error(req.statusText));
            }
          };
          req.onerror = function () {
            reject(Error("Network Error"));
          };
          req.send();
        } else if (ratelimit.remaining) {
          reject(ratelimit.remaining + ' requests remaining.');
        }
      })
    };

    const clear_cache = (() => {
      let ratelimit = JSON.parse(GM_getValue('ratelimit_get', '{}'));
      if (ratelimit.used !== undefined && ratelimit.used <= 1) {
        GM_setValue('cache', '{}');
      }
    })();

    function draw_options_panel(fid) {
      const feature = FT[fid];
      const tpl = `<div id="fixd_options" data-id="${fid}" class="fixd_panel">\
      <button class="fixd_btn_back">Back</button>\
      <h2>${feature.label}</h2></div>`;

      const classes = ['fixd_switch', 'fixd_setting_switch'];
      let checked = '';
      if (feature.enabled) {
        classes.push('fixd_enabled');
        checked = 'checked';
      }
      const toggle = `<label data-id="${fid}" class="${classes.join(' ')}"> \
      <input type="checkbox" ${checked}> On</label>`;

      UT.hide(GetElById('fixd_settings_menu'));
      GetElById('fixd_settings').insertAdjacentHTML('beforeend', tpl);

      const panel = GetElById('fixd_options');
      if (!feature.hidden) {
        panel.insertAdjacentHTML('beforeend', toggle);
      }
      draw_option_items(feature.options, panel);
    };
    function draw_option_items(options, target) {
      for (let oid in options) {
        const option = options[oid];
        if (option.hidden) continue;
        const is_bool = ['bool', undefined].includes(option.type);
        const is_on = !option.hasOwnProperty('enabled') || option.enabled;
        const classes = ['fixd_option'];
        if (is_bool) {
          classes.push('fixd_switch', 'fixd_option_switch');
        } else {
          classes.push('fixd_option_btn');
        }
        if (is_on) {
          classes.push('fixd_enabled');
        }
        const template = `<label data-id="${option.id}" class="${classes.join(' ')}">\
        ${is_bool ? `<input type="checkbox" ${is_on ? `checked` : ``}> ` : ``}${option.label}</label>`;
        target.insertAdjacentHTML('beforeend', template);
      }
    };
    function draw_option_choices(data, saved, target) {
      for (let uid in data.choices) {
        const label = data.choices[uid][1];
        const classes = ['fixd_option_select'];
        let type = 'radio';
        let checked = '';
        if (data.type !== 'radio') {
          type = 'checkbox';
        }
        if (saved.value.includes(uid)) {
          checked = 'checked';
          classes.push('fixd_enabled');
        }
        const tpl = `<label class="${classes.join(' ')}">\
        <input type="${type}" ${checked} name="fixd_option_choices" value="${uid}">\
         ${label}</label>`;
        target.insertAdjacentHTML('beforeend', tpl);
      };
    };
    function draw_option_dialog(oid) {
      const panel = GetElById('fixd_options');
      const fid = panel.dataset.id;
      const saved = JSON.parse(GM_getValue('features', '{}'));
      const option = FT[fid].options[oid];
      const saved_option = saved[fid].options[oid];
      const type = option.type;
      const is_on = saved_option.enabled;
      let list_val;

      if (type === 'list') {
        saved_option.value.sort((a, b) => {
          return a.localeCompare(b, 'en', { 'sensitivity': 'base' });
        });
        list_val = saved_option.value.join('\n');
      }

      let toggle = '';
      if (option.hasOwnProperty('enabled')) {
        const classes = ['fixd_switch', 'fixd_option_switch'];
        if (is_on) {
          classes.push('fixd_enabled');
        }
        toggle = `<label class="${classes.join(' ')}" data-id="${oid}">\
        <input type="checkbox" ${is_on ? `checked` : ``}> On</label>`;
      }

      const description = option.description ? option.description : '';
      const tpl = `\
      <div id="fixd_dialog" data-id="${oid}">\
        <div class="fixd_settings_header">\
          <button class="fixd_btn_back">Back</button>\
          <h3>${FT[fid].label} <span>${option.label}</span></h3>\
        </div>\
        ${toggle}\
        <div class="fixd_description">${description}</div>\
        <div class="fixd_settings_buttons">\
        <button class="fixd_btn_save">Save changes</button></div>\
        ${type === 'list' ? `<textarea name="fixd_option_list">${list_val}</textarea>` : ``}\
      </div>`;

      panel.insertAdjacentHTML('beforeend', tpl);
      const dialog = GetElById('fixd_dialog');
      if (type !== 'list') {
        draw_option_choices(option, saved_option, dialog);
      }
      GetElById('fixd_settings').classList.add('fixd_expanded');
    };

    function close_dialog() {
      GetElById('fixd_settings').classList.remove('fixd_expanded');
      $('#fixd_dialog').remove();
    };

    function handle_submit() {
      const panel = GetElById('fixd_options');
      const fid = panel.dataset.id;
      const oid = GetElById('fixd_selected_option').dataset.id;
      const saved = JSON.parse(GM_getValue('features', '{}'));
      const feature = FT[fid];
      const option = feature.options[oid];
      let db_entry = saved;
      if (option.type === 'list') {
        let value = GetElsByName('fixd_option_list')[0].value;
        value = value.replace(/[^a-zA-Z\d\n#._-]/mg, "");
        db_entry[fid].options[oid].value = value.split('\n');
      }
      else if (option.hasOwnProperty('choices')) {
        const choices = GetElsByName('fixd_option_choices');
        // Clear the old value before repopulating.
        db_entry[fid].options[oid].value = [];
        function handle_choices(el, idx) {
          if (el.value && el.checked) {
            if (option.type === 'radio') {
              db_entry[fid].options[oid].value[0] = el.value;
              return false;
            }
            else {
              db_entry[fid].options[oid].value[idx] = el.value;
            }
          }
        }
        choices.forEach(handle_choices);
      }
      GM_setValue('features', JSON.stringify(db_entry));
      feature.update_values(oid, db_entry[fid].options[oid].value);
      close_dialog();
    };

    function handle_back(ev) {
      if (GetElById('fixd_dialog')) {
        close_dialog();
      } else {
        $('#fixd_options').remove();
        UT.show(GetElById('fixd_settings_menu'));
      }
    };

    function close_settings() {
      GetEls('#fixd_settings, #fixd_launch').forEach(e => e.classList.remove('fixd_active'));
      close_dialog();
    };

    function handle_settings_click(ev) {
      const clicked = ev.target;
      const parent = clicked.parentNode;
      const class_list = clicked.classList;
      const has_class = c => class_list ? class_list.contains(c) : false;
      const data_id = clicked.dataset.id;
      const is_input = clicked.tagName === 'INPUT';
      if (has_class('fixd_setting_btn')) {
        draw_options_panel(data_id);
      }
      else if (has_class('fixd_option_btn')) {
        let selected = GetElById('fixd_selected_option');
        if (selected) selected.removeAttribute('id');
        clicked.id = 'fixd_selected_option';
        draw_option_dialog(data_id);
      }
      else if (has_class('fixd_btn_save')) {
        handle_submit(ev);
      }
      else if (has_class('fixd_btn_back')) {
        handle_back(ev);
      }
      else if (is_input && parent.classList.contains('fixd_switch')) {
        handle_switch(parent);
      }
      else if (is_input && parent.classList.contains('fixd_option_select')) {
        if (clicked.getAttribute('type') === 'radio') {
          let choices = GetElsByName('fixd_option_choices');
          choices.forEach(i => i.parentNode.classList.remove('fixd_enabled'));
        }
        parent.classList.toggle('fixd_enabled');
      }
    };

    const insert_settings_form = (() => {
      const tpl = `<div id="fixd_settings" data-version="${GM_info.script.version}">
      <div id="fixd_settings_menu" class="fixd_panel"><h1>Fixdit Settings</h1></div></div>`;
      document.body.insertAdjacentHTML('beforeend', tpl);
      const box = GetElById('fixd_settings');
      box.addEventListener('click', handle_settings_click, false);
    })();

    function draw_setting(data) {
      const classes = ['fixd_option_btn', 'fixd_setting_btn'];

      if (data.enabled) {
        classes.push('fixd_enabled');
      }
      const template = `<div data-id="${data.id}" class="${classes.join(' ')}">\
      ${data.label}</div>`;
      GetElById('fixd_settings_menu').insertAdjacentHTML('beforeend', template);
    }

    document.addEventListener('click', ev => {
      const path = ev.composedPath();
      const launcher = GetElById('fixd_launch');
      const settings = GetElById('fixd_settings');
      const popup = GetElsByClass('fixd_popup')[0];
      if (!path.includes(popup)) {
        FT.subreddit_info.public.close_popup();
      }
      if (!path.includes(launcher) &&
        !path.includes(settings)) {
        close_settings();
      }
      if (ev.target === launcher) {
        if (ev.target.classList.contains('fixd_active')) {
          close_settings();
        }
        else {
          launcher.classList.add('fixd_active');
          settings.classList.add('fixd_active');
          $('#fixd_options').remove();
          UT.show(GetElById('fixd_settings_menu'));
        }
      }
    });
    function handle_switch(clicked) {
      const saved = JSON.parse(GM_getValue('features', '{}'));
      const fid = GetElById('fixd_options').dataset.id;
      const feature = FT[fid];
      const db_entry = saved;
      const nodes = [clicked];

      let oid;
      if (clicked.classList.contains('fixd_option_switch')) {
        oid = clicked.dataset.id;
      }

      if (oid) {
        if (GetElById('fixd_dialog')) {
          nodes.push(GetEl(`.fixd_option_btn[data-id="${oid}"]`));
        }
        if (saved[fid].options[oid].enabled) {
          db_entry[fid].options[oid].enabled = false;
        } else {
          db_entry[fid].options[oid].enabled = true;
        }
        feature.update_option(db_entry[fid].options[oid].enabled, oid, nodes);
      } else if (fid) {
        nodes.push(GetEl(`.fixd_setting_btn[data-id="${fid}"]`));
        if (saved[fid].enabled) {
          db_entry[fid].enabled = false;
        } else {
          db_entry[fid].enabled = true;
        }
        feature.update(db_entry[fid].enabled, nodes);
      } else {
        return;
      }
      GM_setValue('features', JSON.stringify(db_entry));
    }
    // Begin modules/features.
    const FT = {};
    FT.ui_selectors = (() => {
      const ftr = new Feature({
        id: "ui_selectors",
        label: "Add UI Selectors",
        enabled: true,
        internal: true,
        hidden: true
      });
      function tag_body() {
        const layout_switch_card = GetElById('layoutSwitch--card');

        if (!layout_switch_card) return;

        const layout_switches_wrap = layout_switch_card.parentNode;
        let view_mode;

        for (const button of layout_switches_wrap.getElementsByTagName('button')) {
          const pressed = JSON.parse(button.getAttribute('aria-pressed'));
          if (pressed) {
            view_mode = button.getAttribute('aria-label');
          }
        }

        document.body.dataset.fixdView = view_mode;

        const list_area = GetEl('header').parentNode.nextElementSibling;
        if (list_area) {
          list_area.classList.add('fixd_list_area');
        }
      }
      function tag_subreddits_boxes(arg) {
        if (!arg) return;
        let region = arg;
        let is_profile = UT.page_type('profile');
        let lightbox = GetElById('overlayScrollContainer');
        for (const el of region.getElementsByTagName('button')) {
          if (UT.list_has(['subscribe', 'unsubscribe'], el.innerText, true)) {
            const item = el.parentNode.parentNode;
            const img = item.getElementsByTagName('img');
            const svg = item.getElementsByTagName('svg');
            if (img.length === 1 || svg.length === 1) {
              let contents = item.parentNode.parentNode.parentNode;
              if (is_profile && !lightbox) {
                contents = contents.parentNode;
              }
              const a = item.querySelector('a');
              const sib = a.nextElementSibling;
              const p = sib && sib.tagName === 'P' ? sib : undefined;
              if (p && a.getAttribute('href').startsWith('/r/') && UT.node_text_includes('subscribers', p)) {
                let container = contents.parentNode.parentNode;
                container.classList.add('fixd--subreddits');
                break;
              }
            }
          }
        }
        region = [...GetElsByClass('fixd--subreddits')].pop();
        region = region ? region.nextElementSibling : undefined;
        if (!region) return;
        let button = region.querySelector('button');
        let label = button ? button.innerText.toUpperCase() : undefined;
        if (UT.list_has(['subscribe', 'unsubscribe'], label, true)) {
          // Repeat
          tag_subreddits_boxes(region);
        }
      };
      function tag_content(region, np) {
        const posts = document.getElementsByClassName('Post');
        if (posts.length) {
          // Walk thru parents if np is defined, else take 'region' as content node.
          let content = np ? UT.nth_parent(posts[0], np) : region;
          content.classList.add('fixd--content');
          tag_side(content);
        }

        const overlay = GetElById('overlayScrollContainer');
        if (overlay) {
          const overlayHead = overlay.parentNode.previousSibling;
          if (overlayHead) {
            overlayHead.classList.add('fixd_overlay_head');
          }
        }
      };
      const tag_side = content => {
        const side = content.nextElementSibling;
        if (!side) return;
        side.classList.add('fixd--side');
        const mods_h = UT.get_els_by_text('Moderators', 'h3', side)[0];
        if (mods_h) {
          mods_h.parentNode.classList.add('fixd--moderators');
        }
        tag_subreddits_boxes(side);
      };

      // doc loaded:
      tag_body();

      if (UT.page_type('comments')) {
        tag_content(document, 3);
      }

      else if (UT.page_type('profile')) {
        const images = GetEl('header').parentNode.nextElementSibling.getElementsByTagName('img');
        for (const img of images) {
          if (img.src && img.src.startsWith('https://www.redditstatic.com/avatars')) {
            let a = img.parentNode.parentNode.querySelector('a');
            if (a && a.href && a.getAttribute('href').startsWith('/user/')) {
              return tag_content(UT.nth_parent(img, 5), 7);
            }
          }
        }
      }

      else if (UT.page_type('listing')) {
        tag_content(document, 5);
      }

      Content_Obs.extend((self, node) => {
        tag_body();
        tag_content(document, 5);
      });
      Lb_Obs.extend((self, node) => {
        tag_content(node.children[0].children[0]);
      });
      Side_Obs.extend((self, node) => {
        tag_subreddits_boxes(self.target);
      });
      return ftr;
    })();
    FT.ui_tweaks = (() => {
      const ftr = new Feature({
        id: "ui_tweaks",
        label: "UI Tweaks",
        enabled: false
      });
      ftr.add_option({
        id: 'middle_click_posts',
        label: 'Middle mouse click behavior',
        description: `Choose what happens when you press the middle mouse\
        button in the empty space of a post. Might not work for Firefox.`,
        enabled: false,
        type: 'radio',
        choices: {
          1: ['do_nothing', "Do nothing (no scroll)"],
          2: ['view_thread', 'Open comments in new tab'],
          3: ['view_thread_fg', 'Open comments & switch to tab']
        },
        value: ['1']
      });
      ftr.add_option({
        id: "no_prefix",
        label: "No prefixes for subreddits, users",
        type: "bool",
        enabled: false
      });
      ftr.add_option({
        id: "no_blanks",
        label: "All links can open in current tab",
        type: "bool",
        enabled: false
      });
      ftr.add_option({
        id: "override_vote_icons",
        label: "Override custom vote icons",
        enabled: false,
        type: "bool"
      });
      ftr.add_option({
        id: "static_header",
        label: "Make the top bar stationary/static",
        enabled: false,
        type: "bool"
      });
      ftr.add_option({
        id: "reduce_comment_spacing",
        label: "Reduce comment spacing",
        enabled: false,
        type: 'bool'
      });
      ftr.add_option({
        id: "visited_links",
        label: "Different color for visited links",
        enabled: true,
        type: 'bool'
      });
      ftr.add_option({
        id: "expando_hitbox",
        label: "Tighten expando hover area (in compact mode)",
        enabled: true,
        type: 'bool'
      });

      function handle_mousedown(ev) {
        if (ev.button !== 1) return;
        const lb = GetElById('overlayScrollContainer');
        const listing = UT.page_type('listing', 'search');
        if (!lb && listing) {
          let path = ev.composedPath();
          let post = (() => {
            // Check if I clicked inside a post or link.
            for (let i = 0; i < path.length; i++) {
              let n = path[i];
              let has_class = c => n.classList ? n.classList.contains(c) : false;
              if (['A', 'BODY'].includes(n.tagName) || has_class('fixd--side')) break;
              if (has_class('Post')) {
                const link = n.querySelector('a[data-click-id="body"]');
                if (link) {
                  return { el: n, url: link.href };
                }
              }
            }
          })();
          if (post) {
            ev.stopImmediatePropagation();
            ev.preventDefault();
            if (ftr.options.middle_click_posts.value[0] !== '1') {
              let bg = false;
              if (ftr.options.middle_click_posts.value[0] === '2') {
                bg = true;
              }
              GM_openInTab(post.url, bg);
            }
          }
        }
      };

      function config_middle_click(feature_on) {
        if (feature_on && ftr.options.middle_click_posts.enabled) {
          document.body.addEventListener('mousedown', handle_mousedown, false);
        } else {
          document.body.removeEventListener('mousedown', handle_mousedown);
        }
      };

      function check_vote_icon(up) {
        const wrap = up.parentNode;
        const down = wrap.querySelector('button[data-click-id="downvote"]');
        const score = wrap.querySelector('div');

        // Customized vote buttons do not have child nodes (until we add one via CSS)
        if (!up.children.length) override_vote_icon(up);
        if (!down.children.length) override_vote_icon(down);

        // remove colour override from score.
        if (up.classList.contains('fixd_no_icon') || down.classList.contains('fixd_no_icon')) {
          wrap.classList.add('fixd_override_vote_icon');
        }
      };

      function init_override_vote_icons(region) {
        if (ftr.options.override_vote_icons.enabled) {
          const selector = 'button[data-click-id="upvote"]';
          region.querySelectorAll(selector).forEach(check_vote_icon);
        }
      };

      function override_vote_icon(el) {
        // Remove style override so we can search the url string for active/inactive
        el.classList.add('fixd_no_icon');
        el.style.background = 'none';
      }

      function strip_prefixes(node) {
        if (ftr.options.no_prefix.enabled) {
          let u = UT.get_post_author_link(node);
          if (u) {
            u.innerText = u.innerText.replace("u/", "");
          }
          let sub_links = node.querySelectorAll('a[data-click-id="subreddit"]');
          for (const a of sub_links) {
            if (!a.children.length) {
              a.innerText = a.innerText.replace("r/", "");
            }
          };
        }
      };
      function remove_blanks(region) {
        if (ftr.options.no_blanks.enabled) {
          const anchors = region.getElementsByTagName('a');
          for (let i = 0; i < anchors.length; i++) {
            if (anchors[i].getAttribute('target')) {
              anchors[i].removeAttribute('target');
              anchors[i].classList.add('fixd_no_blank');
            }
          }
        }
      };
      function static_header(feature_on) {
        if (feature_on && ftr.options.static_header.enabled) {
          const header = GetEl('header');
          document.body.classList.add('fixd_static_header');
        } else {
          const header = GetEl('header');
          document.body.classList.remove('fixd_static_header');
        }
      };

      function reduce_comment_spacing(feature_on) {
        if (feature_on && ftr.options.reduce_comment_spacing.enabled) {
          document.body.classList.add('fixd_reduce_comment_spacing');
        } else {
          document.body.classList.remove('fixd_reduce_comment_spacing');
        }
      }

      function visited_links(feature_on) {
        if (feature_on && ftr.options.visited_links.enabled) {
          document.body.classList.add('fixd_visited_links');
        } else {
          document.body.classList.remove('fixd_visited_links');
        }
      }

      function expando_hitbox(feature_on) {
        if (feature_on && ftr.options.expando_hitbox.enabled) {
          document.body.classList.add('fixd_expando_hitbox');
        } else {
          document.body.classList.remove('fixd_expando_hitbox');
        }
      }

      ftr.on_toggle_option = {
        'static_header': static_header,
        'reduce_comment_spacing': reduce_comment_spacing,
        'visited_links': visited_links,
        'expando_hitbox': expando_hitbox,
        'middle_click_posts': config_middle_click
      };

      if (ftr.enabled) {
        config_middle_click(ftr.enabled);
        static_header(ftr.enabled);
        reduce_comment_spacing(ftr.enabled);
        visited_links(ftr.enabled);
        expando_hitbox(ftr.enabled);
        init_override_vote_icons(document.body);
        remove_blanks(document);
        const posts = GetElsByClass('Post');
        for (const post of posts) {
          strip_prefixes(post);
          remove_blanks(post);
        }
        Lb_Obs.extend((self, node) => {
          init_override_vote_icons(node);
          remove_blanks(node);
        });
        Lb_Comments_Obs.extend((self, node) => {
          init_override_vote_icons(node);
          remove_blanks(node);
        });
        Content_Obs.extend((self, node) => {
          const posts = self.target.getElementsByClassName('Post');
          for (const post of posts) {
            strip_prefixes(post);
            remove_blanks(post);
            init_override_vote_icons(post);
          }
        });
        Post_Obs.extend((self, node) => {
          strip_prefixes(node);
          init_override_vote_icons(node);
          remove_blanks(node);
        });
        Comment_Obs.extend((self, node) => {
          init_override_vote_icons(node);
          remove_blanks(node);
        });
        document.body.addEventListener('click', ev => {
          if (['upvote', 'downvote'].includes(ev.target.dataset.clickId)) {
            init_override_vote_icons(ev.target.parentNode);
          }
        });
      }
      return ftr;
    })();
    FT.filter_content = (function () {
      const ftr = new Feature({
        id: "filter_content",
        label: "Filter Content",
        enabled: true
      });
      ftr.add_option({
        id: "subreddits",
        label: "Posts by subreddit",
        type: "list",
        enabled: true,
        description: "One <em>subreddit name</em> per line. No commas or slashes. Ignores search results.",
        value: []
      });
      ftr.add_option({
        id: "users",
        label: "Posts by user",
        description: "One <em>user name</em> per line. No commas or slashes. Ignores search results.",
        type: "list",
        enabled: false,
        value: []
      });
      ftr.add_option({
        id: "comments",
        label: "Comments by user",
        description: "One <em>user name</em> per line. No commas or slashes.",
        type: "list",
        enabled: false,
        value: []
      });
      const blocked_subs = ftr.options.subreddits.value.map(i => i.toUpperCase());
      const blocked_submitters = ftr.options.users.value.map(i => i.toUpperCase());
      const blocked_comments = ftr.options.comments.value.map(i => i.toUpperCase());

      const regex = {
        url_subreddit: /.*\/r\//i,
        url_user: /.*\/user\//i
      };

      function init_posts(region) {
        if (UT.page_type('comments', 'search', 'profile')) return;
        const posts = region.getElementsByClassName('Post');
        for (let i = 0; i < posts.length; i++) {
          filter_post(posts[i].parentNode.parentNode);
        }
      };

      function init_comments(region) {
        const comments = region.getElementsByClassName('Comment');
        for (let i = 0; i < comments.length; i++) {
          filter_comment(UT.nth_parent(comments[i], 3));
        }
      };

      function filter_post(node) {
        let sub_href, user_href;
        if (ftr.options.subreddits.enabled) {
          let sub_a = node.querySelector('a[data-click-id="subreddit"]');
          sub_href = sub_a ? sub_a.getAttribute('href') : undefined;
        }
        if (ftr.options.users.enabled) {
          let user_a = UT.get_post_author_link(node);
          user_href = user_a ? user_a.getAttribute('href') : undefined;
        }
        if (sub_href) {
          let sub_name = sub_href.replace(regex.url_subreddit, "").replace("/", "");

          if (UT.list_has(blocked_subs, sub_name.toUpperCase())) {
            node.classList.add('fixd_hidden');
          }
        }
        if (!node.classList.contains('fixd_hidden') && user_href) {
          let user_name = user_href.replace(regex.url_user, "").replace("/", "");

          if (UT.list_has(blocked_submitters, user_name.toUpperCase())) {
            node.classList.add('fixd_hidden');
          }
        }
      };

      function filter_comment(node) {
        const comment_body = node.querySelector('.Comment').children[1];
        if (!comment_body) return;

        let user_link = comment_body.children[0].querySelector('a');
        user_link = user_link ? user_link.getAttribute('href') : undefined;
        if (!user_link) return false;

        let user_name = user_link.replace(regex.url_user, "");
        user_name = user_name.replace("/", "");

        if (UT.list_has(blocked_comments, user_name.toUpperCase())) {
          node.classList.add('fixd_filtered');

          let cid;
          node.querySelector('.Comment').classList.forEach(str => {
            const match = /^t1_/.exec(str);
            if (match) {
              cid = match.input;
              return false;
            }
          });

          let c_node = GetElById(cid);
          const tpl = `<div class="fixd_filter_msg"><span>${user_name}</span>\
          <em>(Fixdit filtered)</em>\
          <button data-click-id="fixd_unfilter_btn">Show comment</button></div>`;
          c_node.insertAdjacentHTML('beforeend', tpl);
        }
      };

      function handle_body_click(ev) {
        let clicked = ev.target;
        if (clicked.dataset.clickId === 'fixd_unfilter_btn') {
          // TBDL: reconnect comment_change observer for fixd_collapse.
          let comment = $(clicked).parents('.fixd_filtered')[0];

          if (comment.classList.contains('fixd_filtered')) {
            comment.classList.replace('fixd_filtered', 'fixd_unfiltered');
          }
          else if (comment.classList.contains('fixd_unfiltered')) {
            comment.classList.replace('fixd_unfiltered', 'fixd_filtered');
          }
        }
      };
      if (ftr.enabled) {
        if (ftr.options.comments.enabled) {
          init_comments(document);
          document.body.addEventListener('click', handle_body_click, false);
          Lb_Comments_Obs.extend((self, node) => {
            init_comments(node);
          });
          Comment_Obs.extend((self, node) => {
            filter_comment(node);
          });
        }

        if (ftr.options.subreddits.enabled || ftr.options.users.enabled) {
          // document ready:
          init_posts(document);

          Content_Obs.extend((self, node) => {
            init_posts(self.target);
          });

          Post_Obs.extend((self, node) => {
            if (node.classList.contains('Post')) {
              node = node.parentNode.parentNode;
            }
            filter_post(node);
          });
        }
      }
      return ftr;
    })();
    FT.subreddit_info = (function () {
      const ftr = new Feature({
        id: "subreddit_info",
        label: "Subreddit Info Box",
        enabled: true
      });
      ftr.add_option({
        id: 'delay',
        label: 'Popup delay',
        choices: {
          1: ['short', 'Short', 200],
          2: ['medium', 'Medium', 400],
          3: ['long', 'Long', 700]
        },
        value: ['2'],
        type: 'radio'
      });
      const delay_uid = ftr.options.delay.value[0];
      const delay_open = ftr.options.delay.choices[delay_uid][2] || 400;
      const delay_close = 100;
      let tmo_open;
      let tmo_close;

      function get_popup() {
        ftr.public.close_popup();
        const box = $('<div>', {
          "id": "fixd_popup_subreddit",
          "class": 'fixd_popup'
        }).css({ 'display': 'none' })[0];

        box.addEventListener('click', ev => {
          if (ev.target.classList.contains('fixd_popup_filter')) {
            const saved = JSON.parse(GM_getValue('features', '{}'));
            const name = GetElById('fixd_popup_subreddit').dataset.id;
            let db_entry = saved;
            if (ev.target.classList.contains('fixd_active')) {
              const list = db_entry.filter_content.options.subreddits.value;
              const rexp = RegExp(name, 'gi');
              db_entry.filter_content.options.subreddits.value = list.filter(i => !rexp.test(i));
              ev.target.classList.remove('fixd_active');
            }
            else {
              db_entry.filter_content.options.subreddits.value.push(name);
              ev.target.classList.add('fixd_active');
            }
            GM_setValue('features', JSON.stringify(db_entry));
          }
        }, false);

        box.addEventListener('mouseover', ev => {
          window.clearTimeout(tmo_close);
        }, false);

        box.addEventListener('mouseleave', ev => {
          ftr.public.close_popup();
        }, false);
        return box;
      };

      function add_popup(data, ev) {
        const box = get_popup();
        const filter_btn_classes = ["fixd_popup_filter"];
        const saved = JSON.parse(GM_getValue('features', '{}'));
        const filter_data = saved.filter_content.options.subreddits;
        if (data.subscriber) {
          box.classList.add('fixd_subscriber');
        }
        if (saved.filter_content.enabled && filter_data.enabled) {
          box.classList.add('fixd_filterable');
          if (UT.list_has(filter_data.value, data.name, true)) {
            filter_btn_classes.push('fixd_active');
          }
        }
        let document_width = GetEl('html').offsetWidth;
        let target_offset = $(ev.target).offset().left;
        let offset_left = target_offset;
        if ((document_width - target_offset) < (document_width / 2)) {
          offset_left -= 240;
        }
        const subtitle = data.subtitle ? data.subtitle : '';
        const description = data.desc ? data.desc : '';
        const content = `<div>\
          <h2>${data.name}</h2>\
          <div class="fixd_popup_created">${data.created}</div>\
          <div class="fixd_popup_subs">\
          <span class="fixd_popup_subs">${data.subs}</span> Subscribers\
          </div>\
          <button class="${filter_btn_classes.join(' ')}">Filter</button>\
          </div><div>\
          <div class="fixd_popup_title">${data.title}</div>\
          <div class="fixd_popup_subtitle">${subtitle}</div>\
          <div class="fixd_popup_desc">${description}</div></div>`;
        box.dataset.id = data.name;
        box.style.top = $(ev.target).offset().top + ev.target.offsetHeight + 'px';
        box.style.left = offset_left + 'px';
        box.insertAdjacentHTML('beforeend', content);
        document.body.appendChild(box);
        UT.show(box);
      };

      function init_popup(ev) {
        let name = ev.target.getAttribute('href').split('/')[2];
        get_reddit_data('t5', name).then((data) => {
          const date_created = new Date(data.created * 1000);
          const formatted = {
            name: data.name,
            title: data.title,
            subtitle: data.subtitle,
            created: UT.format_date.age(date_created),
            subs: data.subs.toLocaleString(),
            subscriber: data.subscriber,
            desc: data.desc
          };
          // Stop if mouse pointer exited the target element.
          if (!tmo_open) return;

          add_popup(formatted, ev);
        }, function (error) {
          console.warn("Error retrieving subreddit info popup.", error);
        });
      };

      ftr.public.close_popup = (ev) => {
        const popup = GetElById('fixd_popup_subreddit');
        if (popup) popup.remove();
      };

      if (ftr.enabled) {
        document.body.addEventListener('mouseover', ev => {
          if (ev.target.tagName === 'A') {
            let a = ev.target;
            if ((a.dataset.clickId === 'subreddit' ||
              $(a).parents('p, .md, .fixd--subreddits').length) &&
              a.getAttribute('href').startsWith('/r/')) {

              window.clearTimeout(tmo_open);
              window.clearTimeout(tmo_close);

              tmo_open = window.setTimeout(() => {
                init_popup(ev);
              }, delay_open);

              let mouse_out = (ev) => {
                ev.target.removeEventListener('mouseleave', mouse_out);
                window.clearTimeout(tmo_open);
                tmo_open = null;

                tmo_close = window.setTimeout(() => {
                  ftr.public.close_popup();
                }, delay_close);
              };
              a.addEventListener('mouseleave', mouse_out);
            }
          }
        });
      }
      return ftr;
    })();
    FT.comments_collapse = (function () {
      const ftr = new Feature({
        id: "comments_collapse",
        label: "Collapsible Child Comments",
        enabled: true
      });
      ftr.add_option({
        id: 'auto',
        type: 'bool',
        label: 'Automatically collapse children',
        enabled: false
      });

      const auto_on = ftr.options.auto.enabled;

      function init(region, is_mutate) {
        let lb = GetElById('overlayScrollContainer');
        if (!lb && UT.page_type('profile')) return;
        let comments = region.getElementsByClassName('Comment');
        if (comments.length) {
          let comments_list = UT.nth_parent(comments[0], 4).children;
          const sort_picker = GetElById('CommentSort--SortPicker').parentNode;
          const btn_all_classList = ['fixd_collapse_all'];
          if (auto_on && !is_mutate) {
            btn_all_classList.push('fixd_active');
          }
          const btn_all = `<button class="${btn_all_classList.join(' ')}">children</button>`;
          if (sort_picker) {
            sort_picker.insertAdjacentHTML('beforeend', btn_all);
          }
          for (let i = 0; i < comments_list.length; i++) {
            init_comment(comments_list[i], is_mutate);
          }
        }
      };

      function init_comment(item, is_mutate) {
        item.classList.add('fixd_comment_wrap');
        const is_comment = !!item.getElementsByClassName('Comment').length;
        const is_child = !item.getElementsByClassName('top-level').length;
        const is_hidden = !!item.getElementsByClassName('icon-expand').length;

        if (is_comment && !is_child) {
          item.classList.add('fixd_top-level');
          const next = item.nextElementSibling;
          const next_is_child = next && !next.getElementsByClassName('top-level').length;
          const next_is_thread = next && !!next.getElementsByClassName('threadline').length;

          if (next_is_child && next_is_thread && !is_hidden && !item.querySelector('.fixd_collapse')) {
            const btn_classList = ['fixd_collapse'];

            if (auto_on && !is_mutate) {
              btn_classList.push('fixd_active');
            }
            const btn = `<button class="${btn_classList.join(' ')}">children</button>`;
            let target = [...item.getElementsByTagName('button')].pop();
            if (!target) target = [...item.getElementsByTagName('a')].pop();
            if (target) target.insertAdjacentHTML('afterend', btn);
          }
        }
        if (auto_on && is_child && !is_mutate) {
          item.classList.add('fixd_hidden');
        }
      };

      function toggle_visibility(clicked) {
        let wrap = $(clicked).parents('.fixd_comment_wrap')[0];
        let is_active = clicked.classList.contains('fixd_active');

        function check_next(node) {
          const node_is_child = !node.getElementsByClassName('top-level').length;
          const node_is_thread = !!node.getElementsByClassName('threadline').length;
          if (node_is_child && node_is_thread) {
            if (is_active) {
              node.classList.remove('fixd_hidden');
            } else {
              node.classList.add('fixd_hidden');
            }
            if (node.nextElementSibling) {
              check_next(node.nextElementSibling);
            }
          }
        };
        const next = wrap.nextElementSibling;
        if (next) check_next(next);
        clicked.classList.toggle('fixd_active');
      };

      function handle_click(ev) {
        if (ev.target.classList.contains('fixd_collapse')) {
          ev.stopImmediatePropagation();
          toggle_visibility(ev.target);
        }
        else if (ev.target.classList.contains('fixd_collapse_all')) {
          ev.stopImmediatePropagation();
          if (ev.target.classList.contains('fixd_active')) {
            GetEls('.fixd_collapse.fixd_active').forEach(e => e.click());
          }
          else {
            GetEls('.fixd_collapse:not(.fixd_active)').forEach(e => e.click());
          }
          if (GetEls('.fixd_collapse:not(.fixd_active)').length) {
            ev.target.classList.remove('fixd_active');
          }
          else {
            ev.target.classList.add('fixd_active');
          }
        }
      };

      if (ftr.enabled) {
        init(document, false);
        document.body.addEventListener('click', handle_click, false);
        Lb_Obs.extend((self, node) => {
          init(node, true);
        });
        Lb_Comments_Obs.extend((self, node) => {
          init(node, true);
        });
        Comment_Obs.extend((self, node, mutation) => {
          init_comment(mutation.previousSibling, true);
        });
      }
      return ftr;
    })();
    FT.menu_hover = (function () {
      const ftr = new Feature({
        id: "menu_hover",
        label: "Hover to open menus",
        enabled: false
      });
      ftr.add_option({
        id: 'menus',
        label: "Choose menus",
        enabled: true,
        type: 'checkbox',
        choices: {
          1: ['sortpicker', 'Sort Posts', '#ListingSort--SortPicker'],
          2: ['commentsort', 'Comment Sort Picker', '#CommentSort--SortPicker'],
          3: ['user', 'User dropdown', '#USER_DROPDOWN_ID'],
          4: ['headermoderate', 'Moderate (header)', '#Header--Moderation']
        },
        value: ['1', '2', '3', '4']
      });
      ftr.add_option({
        id: 'delay',
        label: "Delay",
        requires: "menus",
        type: 'radio',
        choices: {
          1: ['short', 'Short', 200],
          2: ['medium', 'Medium', 400],
          3: ['long', 'Long', 700]
        },
        value: ['2']
      });
      const menus_val = ftr.options.menus.value;
      const delay_uid = ftr.options.delay.value[0];
      const delay_open = ftr.options.delay.choices[delay_uid][2] || 700;

      if (ftr.enabled && ftr.options.menus.enabled) {
        function init() {
          for (let i = 0; i < menus_val.length; i++) {
            const uid = menus_val[i];
            if (uid !== null) {
              add_menu_listener(ftr.options.menus.choices[uid]);
            }
          }
        };
        function add_menu_listener(menu) {
          let commit_timeout;
          const name = menu[0];
          let el = GetEl(menu[2]);
          if (name === 'sortpicker') {
            el = el ? el.parentNode : undefined;
          }
          if (!el) return;
          el.addEventListener('mouseenter', (ev) => {
            const target = ev.currentTarget;
            commit_timeout = window.setTimeout(() => {
              target.click();
            }, delay_open);
          }, false);
          el.addEventListener('mouseleave', () => {
            window.clearTimeout(commit_timeout);
          }, false);
        };
        init();
        if (menus_val.includes('2')) {
          Lb_Comments_Obs.extend((self, node) => {
            add_menu_listener(ftr.options.menus.choices[2]);
          });
        }
      }
      return ftr;
    })();
    FT.remindme = (function () {
      const ftr = new Feature({
        id: "remindme",
        label: "Remind Me",
        enabled: false,
        hidden: true
      });
      return ftr;
    })();
    FT.debug = (function () {
      const ftr = new Feature({
        id: "debug",
        label: "Debug Fixdit",
        enabled: false
      });
      function init(enabled) {
        if (enabled) {
          document.body.classList.add('fixd_debug');
        } else {
          document.body.classList.remove('fixd_debug');
        }
      };
      ftr.on_toggle = init;
      init(ftr.enabled);
      return ftr;
    })();

    document.body.insertAdjacentHTML('beforeend', `<div id="fixd_launch"></div>`);
  });
})(window.jQuery.noConflict(true));
