// ==UserScript==
// @name        Internet Roadtrip Minimap tricks
// @namespace   jdranczewski.github.io
// @description Provide many bonus options for the Internet Roadtrip minimap.
// @match       https://neal.fun/internet-roadtrip/*
// @icon        https://jdranczewski.dev/irt/images/minimap_tricks.png
// @version     1.5.1
// @author      jdranczewski (+netux +GameRoMan)
// @license     MIT
// @require     https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2/dist/solid.min.js
// @require     https://cdn.jsdelivr.net/gh/ianengelbrecht/geo-coordinates-parser@b06d051f2a70bc95c2fa1a063ceef85f19823fee/bundle/geocoordsparser.js
// @require     https://cdn.jsdelivr.net/npm/@turf/turf@7.2.0/turf.min.js
// @require     https://cdn.jsdelivr.net/npm/@tmcw/togeojson@7.1.2
// @grant       GM.addStyle
// @grant       GM.getValues
// @grant       GM.info
// @grant       GM.setValues
// @grant       GM.xmlHttpRequest
// @grant       GM_getValue
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/536746/Internet%20Roadtrip%20Minimap%20tricks.user.js
// @updateURL https://update.greasyfork.org/scripts/536746/Internet%20Roadtrip%20Minimap%20tricks.meta.js
// ==/UserScript==

const geoCoordinatesParser = {convert};
(async function (web, IRF, solidJs, geoCoordinatesParser, turf, togeojson) {
'use strict';

if (!IRF.isInternetRoadtrip) return;

function _interopNamespaceDefault(e) {
var n = Object.create(null);
if (e) {
Object.keys(e).forEach(function (k) {
if (k !== 'default') {
var d = Object.getOwnPropertyDescriptor(e, k);
Object.defineProperty(n, k, d.get ? d : {
enumerable: true,
get: function () { return e[k]; }
});
}
});
}
n.default = e;
return Object.freeze(n);
}

var IRF__namespace = /*#__PURE__*/_interopNamespaceDefault(IRF);

var css_248z = "body{height:auto!important}@media (min-width:900px){.map-container .expand-button{cursor:nesw-resize;display:flex!important}.map-container #mini-map{height:var(--map-height,170px)!important;position:relative;width:var(--map-width,250px)!important}.expanded #mini-map{height:var(--map-height-expanded,300px)!important;width:var(--map-width-expanded,450px)!important}.expanded .expand-button img{rotate:180deg}.expanded{opacity:var(--map-opacity-expanded,1)!important}}@media (max-width:900px){.map-container:not(.fullscreen) #mmt-menu{margin-top:-50vh;transform:translateY(calc(-100% + 115px))!important}}.map-container{transition:opacity .5s}.map-container:hover{opacity:1!important}.map-container{z-index:101!important}.map-container.fullscreen{bottom:0;height:100%;left:0;opacity:1!important;top:0;transform:none;width:100%;z-index:-1!important}.map-container.fullscreen #mini-map{border-radius:0;height:100%!important;width:100%!important}.map-container.fullscreen .expand-button{display:none!important}.map-container.fullscreen .maplibregl-ctrl-top-left{margin-left:2px;margin-top:58px}.map-container.fullscreen .maplibregl-ctrl-bottom-right{margin-bottom:186px}.map-container.fullscreen .maplibregl-ctrl-bottom-right .maplibregl-ctrl-scale{margin-right:11px!important}@media (max-width:900px){.map-container.fullscreen .maplibregl-ctrl-bottom-right{margin-bottom:37px}.map-container.fullscreen .maplibregl-ctrl-bottom-left{margin-bottom:19px}.map-container.fullscreen .maplibregl-ctrl-top-left{margin-left:-3px;margin-top:47px}}.map-container.fullscreen .mmt-side-control button[title=\"Fullscreen map\"]{display:block!important}.map-container #mmt-mobile-fs{background-size:contain;height:27px;right:-25px;top:156px;width:27px}.lotwv1-overlay:has(~.fullscreen){display:none!important}.maplibregl-marker{align-items:center;display:flex;justify-content:center;opacity:var(--marker-opacity,1)!important}.mmt-map-menu-opened{opacity:1!important}#mini-map #mmt-menu{position:fixed;transform:translateY(-100%);z-index:1000}#mini-map #mmt-menu button{align-items:center;display:flex;text-align:left;width:100%}#mini-map #mmt-menu .maplibregl-ctrl-icon{width:29px}#mini-map #mmt-menu .maplibregl-ctrl-icon+span{align-items:center;display:flex;margin:0 9px 0 5px}#mini-map #mmt-menu #mmt-menu-label{background:#f1f1f1;display:flex;font-size:14px;justify-content:space-between;margin:5px 0 0;padding:6px}#mini-map #mmt-menu #mmt-menu-label #mmt-menu-close{cursor:pointer;margin-left:10px;margin-right:2px}#mini-map #mmt-menu .mmt-draggable-checkbox-icon{align-items:center;display:flex;justify-content:center}#mini-map #mmt-menu .mmt-draggable-checkbox-icon input{height:50%;pointer-events:none;width:50%}#mini-map #mmt-menu #mmt-menu-color{display:none}#mini-map .mmt-menu-Car .mmt-hide-Car,#mini-map .mmt-menu-Map .mmt-hide-Map,#mini-map .mmt-menu-Marker .mmt-hide-Marker{display:none!important}#mini-map .mmt-menu-Car .mmt-hide-Car,#mini-map .mmt-menu-Map .mmt-hide-Map,#mini-map .mmt-menu-Marker .mmt-hide-Marker{opacity:.5!important}#mini-map .mmt-distance-control{display:flex}#mini-map .mmt-distance-control div{align-items:center;border-right:1px solid #ddd;display:flex;padding:0 5px}#mini-map .maplibregl-ctrl-compass{cursor:pointer}.mmt-miles-decimal .miles-text{line-height:10px;text-align:center}.mmt-miles-decimal .miles-text span{display:inline!important;font-size:10px}@media (display-mode:picture-in-picture){.maplibregl-ctrl-scale{margin:0 5px 5px 0!important}}";

var styles = {"settings-section":"settings-module_settings-section__RSYGf","settings-item-margin":"settings-module_settings-item-margin__l4XUx","settings-item":"settings-module_settings-item__Arp6P","inverse":"settings-module_inverse__8evpX","setting":"settings-module_setting__qVTOm","sidenote":"settings-module_sidenote__6cmf-"};
var stylesheet="a{color:#aaa}.settings-module_settings-section__RSYGf>hr{display:none}.settings-module_settings-section__RSYGf~.settings-module_settings-section__RSYGf>hr{display:block;margin-top:1.5rem}.settings-module_settings-section__RSYGf p{text-align:justify}.settings-module_settings-item-margin__l4XUx{display:grid;margin-right:.5rem}.settings-module_settings-item__Arp6P{align-items:center;display:grid;grid-template-columns:auto 1fr auto;margin-right:.5rem}.settings-module_settings-item__Arp6P.settings-module_inverse__8evpX{grid-template-columns:1fr auto 1fr;margin-left:.75rem;margin-right:1.25rem}.settings-module_settings-item__Arp6P>hr{--un-border-opacity:1;background-color:initial;border-color:rgb(65 71 75/var(--un-border-opacity));border-style:dashed;border-width:1px;color:transparent;width:100%}.settings-module_setting__qVTOm{margin:.5rem .75rem}.settings-module_sidenote__6cmf-{color:#aaa;font-size:.875rem;line-height:1.25rem}";

var _tmpl$$1 = /*#__PURE__*/web.template(`<hr>`),
  _tmpl$2$1 = /*#__PURE__*/web.template(`<h2>`),
  _tmpl$3$1 = /*#__PURE__*/web.template(`<p>`),
  _tmpl$4$1 = /*#__PURE__*/web.template(`<div><span></span><hr><div><input type=checkbox>`),
  _tmpl$5$1 = /*#__PURE__*/web.template(`<div><div><label> <!>: </label><input type=range>`),
  _tmpl$6 = /*#__PURE__*/web.template(`<div><hr><div><button></button></div><hr>`),
  _tmpl$7 = /*#__PURE__*/web.template(`<button>Reset`),
  _tmpl$8 = /*#__PURE__*/web.template(`<div><span>:</span><input style=width:100%>`),
  _tmpl$9 = /*#__PURE__*/web.template(`<div><span>:</span><select style=width:100%>`),
  _tmpl$0 = /*#__PURE__*/web.template(`<option>`),
  _tmpl$1 = /*#__PURE__*/web.template(`<div><p>`);

// Wrapper around IRF panel
class Section {
  constructor(name, settings, description) {
    this.name = name;
    this.settings = settings;
    this.description = description;
    this.container = document.createElement("div");
    this.render_header();
  }
  render_header() {
    this.container.classList.add(styles['settings-section']);
    const _self$ = this;
    const item = [_tmpl$$1(), (() => {
      var _el$2 = _tmpl$2$1();
      web.insert(_el$2, () => _self$.name);
      return _el$2;
    })(), web.createComponent(web.Show, {
      get when() {
        return _self$.description;
      },
      get children() {
        var _el$3 = _tmpl$3$1();
        web.effect(() => _el$3.innerHTML = _self$.description);
        return _el$3;
      }
    })];
    web.render(() => item, this.container);
  }
  add_checkbox(name, identifier, callback = undefined) {
    const _self$2 = this;
    const item = (() => {
      var _el$4 = _tmpl$4$1(),
        _el$5 = _el$4.firstChild,
        _el$6 = _el$5.nextSibling,
        _el$7 = _el$6.nextSibling,
        _el$8 = _el$7.firstChild;
      web.insert(_el$5, name);
      _el$8.addEventListener("change", e => {
        _self$2.settings[identifier] = e.currentTarget.checked;
        GM.setValues(_self$2.settings);
        if (callback) callback(e.currentTarget.checked);
      });
      web.effect(_p$ => {
        var _v$ = styles['settings-item'],
          _v$2 = styles['setting'],
          _v$3 = styles['setting'],
          _v$4 = IRF__namespace.ui.panel.styles.toggle;
        _v$ !== _p$.e && web.className(_el$4, _p$.e = _v$);
        _v$2 !== _p$.t && web.className(_el$5, _p$.t = _v$2);
        _v$3 !== _p$.a && web.className(_el$7, _p$.a = _v$3);
        _v$4 !== _p$.o && web.className(_el$8, _p$.o = _v$4);
        return _p$;
      }, {
        e: undefined,
        t: undefined,
        a: undefined,
        o: undefined
      });
      web.effect(() => _el$8.checked = _self$2.settings[identifier]);
      return _el$4;
    })();
    web.render(() => item, this.container);
  }
  add_slider(name, identifier, callback = undefined, slider_bits = [1, 17, .5]) {
    const [value, setValue] = solidJs.createSignal(this.settings[identifier]);
    solidJs.createEffect(solidJs.on(value, () => {
      this.settings[identifier] = value();
      GM.setValues(this.settings);
      if (callback) callback(value());
    }, {
      defer: true
    }));
    const item = (() => {
      var _el$9 = _tmpl$5$1(),
        _el$0 = _el$9.firstChild,
        _el$1 = _el$0.firstChild,
        _el$10 = _el$1.firstChild,
        _el$12 = _el$10.nextSibling;
        _el$12.nextSibling;
        var _el$13 = _el$1.nextSibling;
      web.insert(_el$1, name, _el$12);
      web.insert(_el$1, value, null);
      _el$13.$$input = e => setValue(e.target.value);
      web.effect(_p$ => {
        var _v$5 = styles['settings-item-margin'],
          _v$6 = styles['setting'],
          _v$7 = slider_bits[0],
          _v$8 = slider_bits[1],
          _v$9 = slider_bits[2],
          _v$0 = IRF__namespace.ui.panel.styles.slider;
        _v$5 !== _p$.e && web.className(_el$9, _p$.e = _v$5);
        _v$6 !== _p$.t && web.className(_el$0, _p$.t = _v$6);
        _v$7 !== _p$.a && web.setAttribute(_el$13, "min", _p$.a = _v$7);
        _v$8 !== _p$.o && web.setAttribute(_el$13, "max", _p$.o = _v$8);
        _v$9 !== _p$.i && web.setAttribute(_el$13, "step", _p$.i = _v$9);
        _v$0 !== _p$.n && web.className(_el$13, _p$.n = _v$0);
        return _p$;
      }, {
        e: undefined,
        t: undefined,
        a: undefined,
        o: undefined,
        i: undefined,
        n: undefined
      });
      web.effect(() => _el$13.value = value());
      return _el$9;
    })();
    web.render(() => item, this.container);
  }
  add_button(name, callback) {
    const item = (() => {
      var _el$14 = _tmpl$6(),
        _el$15 = _el$14.firstChild,
        _el$16 = _el$15.nextSibling,
        _el$17 = _el$16.firstChild;
      _el$17.$$click = () => callback();
      web.insert(_el$17, name);
      web.effect(_p$ => {
        var _v$1 = [styles['settings-item'], styles['inverse']].join(' '),
          _v$10 = styles['setting'];
        _v$1 !== _p$.e && web.className(_el$14, _p$.e = _v$1);
        _v$10 !== _p$.t && web.className(_el$16, _p$.t = _v$10);
        return _p$;
      }, {
        e: undefined,
        t: undefined
      });
      return _el$14;
    })();
    web.render(() => item, this.container);
  }
  add_input(name, identifier, type, callback, default_value) {
    const [value, setValue] = solidJs.createSignal(this.settings[identifier]);

    // We use on with defer here so the effect only runs when value changes
    // and not when the effect is initially created
    solidJs.createEffect(solidJs.on(value, () => {
      this.settings[identifier] = value();
      GM.setValues(this.settings);
      if (callback) callback(value());
    }, {
      defer: true
    }));
    const item = (() => {
      var _el$18 = _tmpl$8(),
        _el$19 = _el$18.firstChild,
        _el$20 = _el$19.firstChild,
        _el$21 = _el$19.nextSibling;
      web.insert(_el$19, name, _el$20);
      _el$21.addEventListener("change", e => setValue(e.target.value));
      web.setAttribute(_el$21, "type", type);
      web.insert(_el$18, web.createComponent(web.Show, {
        when: default_value,
        get children() {
          var _el$22 = _tmpl$7();
          _el$22.$$click = () => setValue(default_value);
          web.effect(() => web.className(_el$22, styles['setting']));
          return _el$22;
        }
      }), null);
      web.effect(_p$ => {
        var _v$11 = styles['settings-item'],
          _v$12 = styles['setting'];
        _v$11 !== _p$.e && web.className(_el$18, _p$.e = _v$11);
        _v$12 !== _p$.t && web.className(_el$19, _p$.t = _v$12);
        return _p$;
      }, {
        e: undefined,
        t: undefined
      });
      web.effect(() => _el$21.value = value());
      return _el$18;
    })();
    web.render(() => item, this.container);
  }
  add_dropdown(name, identifier, values, callback, default_value) {
    const [value, setValue] = solidJs.createSignal(this.settings[identifier]);

    // We use on with defer here so the effect only runs when value changes
    // and not when the effect is initially created
    solidJs.createEffect(solidJs.on(value, () => {
      this.settings[identifier] = value();
      GM.setValues(this.settings);
      if (callback) callback(value());
    }, {
      defer: true
    }));
    const item = (() => {
      var _el$23 = _tmpl$9(),
        _el$24 = _el$23.firstChild,
        _el$25 = _el$24.firstChild,
        _el$26 = _el$24.nextSibling;
      web.insert(_el$24, name, _el$25);
      _el$26.addEventListener("change", e => setValue(e.target.value));
      web.insert(_el$26, web.createComponent(solidJs.For, {
        each: values,
        children: item => (() => {
          var _el$28 = _tmpl$0();
          web.insert(_el$28, () => item[0]);
          web.effect(() => _el$28.value = item[1]);
          return _el$28;
        })()
      }));
      web.insert(_el$23, web.createComponent(web.Show, {
        when: default_value,
        get children() {
          var _el$27 = _tmpl$7();
          _el$27.$$click = () => setValue(default_value);
          web.effect(() => web.className(_el$27, styles['setting']));
          return _el$27;
        }
      }), null);
      web.effect(_p$ => {
        var _v$13 = styles['settings-item'],
          _v$14 = styles['setting'];
        _v$13 !== _p$.e && web.className(_el$23, _p$.e = _v$13);
        _v$14 !== _p$.t && web.className(_el$24, _p$.t = _v$14);
        return _p$;
      }, {
        e: undefined,
        t: undefined
      });
      web.effect(() => _el$26.value = value());
      return _el$23;
    })();
    web.render(() => item, this.container);
  }
  add_comment(text) {
    const item = (() => {
      var _el$29 = _tmpl$1(),
        _el$30 = _el$29.firstChild;
      _el$30.innerHTML = text;
      web.effect(_p$ => {
        var _v$15 = styles['settings-item-margin'],
          _v$16 = styles['setting'];
        _v$15 !== _p$.e && web.className(_el$29, _p$.e = _v$15);
        _v$16 !== _p$.t && web.className(_el$30, _p$.t = _v$16);
        return _p$;
      }, {
        e: undefined,
        t: undefined
      });
      return _el$29;
    })();
    web.render(() => item, this.container);
  }
  add_wide_comment(text) {
    const item = (() => {
      var _el$31 = _tmpl$3$1();
      _el$31.innerHTML = text;
      return _el$31;
    })();
    web.render(() => item, this.container);
  }
}
class Panel extends Section {
  constructor(name, settings, gm_info) {
    super(name, settings);
    this._irf_settings = IRF__namespace.ui.panel.createTabFor(gm_info, {
      tabName: name,
      style: stylesheet
    });
    this.container = this._irf_settings.container;
  }
  render_header() {}
  add_section(name, description) {
    const section = new Section(name, this.settings, description);
    this.container.appendChild(section.container);
    return section;
  }
}
web.delegateEvents(["input", "click"]);

// Default settings
const settings = {
  "expand_map": false,
  "default_zoom": 12.5,
  "timeout_centre": true,
  "timeout_centre_fullscreen_disable": false,
  "reset_zoom": false,
  "disable_fly_in": true,
  "disable_flying_animations": false,
  "align_orientation": false,
  "show_scale": true,
  "km_units": false,
  "decimal_units": false,
  "coordinates_fancy": false,
  "map_size": {
    width: undefined,
    height: undefined,
    expanded_width: undefined,
    expanded_height: undefined
  },
  "map_opacity": "1",
  "background_opacity": "1",
  "map_opacity_expanded": "1",
  "background_opacity_expanded": "1",
  "marker_opacity": "1",
  "route_opacity": "1",
  "marker_color": "#f7a000",
  "markers": {},
  "draggable_markers": true,
  "car_marker_custom": false,
  "car_marker_size": 54,
  "car_marker_url": "https://jdranczewski.dev/irt/images/white_van.png",
  "car_marker_scale": 65,
  "car_marker_rotation": 90,
  "car_marker_flip": false,
  "car_marker_flip_x": false,
  "side_compass": false,
  "coverage": true,
  "coverage_opacity": "0.75",
  "kml_points_opacity": "1",
  "kml_lines_opacity": "1",
  "kml_lines_dashed": true,
  "klm_shapes_opacity": "0.8",
  "klm_shapes_outline_opacity": "0.8",
  "kml_update_check": true
};

// Initialise settings
const storedSettings = await( GM.getValues(Object.keys(settings)));
Object.assign(settings, storedSettings);
// Migrate stored markers to the new format
Object.entries(settings.markers).forEach(([key, value]) => {
  if (Array.isArray(value) && value.length == 2) {
    settings.markers[key] = [value[0], value[1], {}];
  } else if (typeof value[2] === 'string' || value[2] instanceof String) {
    settings.markers[key] = [value[0], value[1], {
      color: value[2]
    }];
  }
});
// Migrate van image from catbox to my server
if (settings.car_marker_url === "https://files.catbox.moe/a55qk5.png") {
  settings.car_marker_url = "https://jdranczewski.dev/irt/images/white_van.png";
}
GM.setValues(settings);

// Update script name so it takes up less space
const gm_info = GM.info;
gm_info.script.name = "Minimap tricks";
gm_info.script.icon = null;
const panel = new Panel("Minimap", settings, gm_info);
const marker_panel = new Panel("Map markers", settings, gm_info);
const error_section = panel.add_section("Minimap Tricks failed to load fully");
error_section.add_comment(`You may encounter problems when running this mod under Tampermonkey or on the Chrome browser.
I recommend using Violentmonkey on any browser other than Chrome. Other Chromium-based browsers should work fine!
`);

const vcontainer = await( IRF__namespace.vdom.container);
const vmap = await( IRF__namespace.vdom.map);
const vodometer = await( IRF__namespace.vdom.odometer);

// Settings page for the side menu
const section$8 = panel.add_section("Side menu", `You can access all map actions by right-clicking the map,
    the car, or added markers. Use the toggles below to pin your favourite buttons to the map's side menu.`);

// Default contexts for the context menu
const contexts = ["Side", "Map", "Car", "Marker"];

// A Maplibre Control class that implements our context and side menus
const mapContainerEl$3 = await( IRF__namespace.dom.map);
class TricksControl {
  // Control container
  // Menu container
  // Menu options container
  // Menu label
  // Settings container

  constructor() {
    this._context = undefined;
    this.lat = 0;
    this.lng = 0;
    this.data = undefined;
    this._c_cont = document.createElement('div'); // Control container
    this._c_cont.className = 'maplibregl-ctrl maplibregl-ctrl-group mmt-side-control';
    this._m_cont = document.createElement('div'); // Menu container
    this._m_cont.id = "mmt-menu";
    this._hide_menu();
    mapContainerEl$3.querySelector('#mini-map').appendChild(this._m_cont);
    document.addEventListener("click", () => {
      this._hide_menu();
    });
    this._m_options = document.createElement('div'); // Menu options container
    this._m_options.className = 'maplibregl-ctrl maplibregl-ctrl-group';
    this._m_cont.appendChild(this._m_options);
    const label_box = document.createElement('div');
    label_box.id = "mmt-menu-label";
    label_box.className = 'maplibregl-ctrl maplibregl-ctrl-group';
    this._m_cont.appendChild(label_box);
    this._m_label = document.createElement('span'); // Menu label
    this._m_label.innerText = "Map";
    const label = document.createElement('span');
    label.innerText = " menu";
    label.prepend(this._m_label);
    label_box.appendChild(label);
    const close = document.createElement('span');
    close.innerText = "X";
    close.id = "mmt-menu-close";
    label_box.appendChild(close);
    this._s_cont = document.createElement('div'); // Settings container
  }
  _show_menu() {
    mapContainerEl$3.classList.add("mmt-map-menu-opened");
  }
  _hide_menu() {
    this._m_cont.style.top = "-10px";
    mapContainerEl$3.classList.remove("mmt-map-menu-opened");
  }
  openMenu(context, lat, lng, left, top, data = undefined) {
    this.context = context;
    this.lat = lat;
    this.lng = lng;
    this.data = data;
    top = Math.max(top, this._m_cont.offsetHeight + 10);
    // Not using "window" directly here to support the PIP case
    left = Math.min(left, this._m_cont.ownerDocument.defaultView.innerWidth - this._m_cont.offsetWidth - 10);
    this._m_cont.style.top = `${top}px`;
    this._m_cont.style.left = `${left}px`;
    this._show_menu();
  }
  set context(value) {
    this._m_label.innerText = value;
    this._m_cont.className = `mmt-menu-${value.replaceAll(' ', '-')}`;
    this._context = value;
  }
  get context() {
    return this._context;
  }
  onAdd(map) {
    this._map = map;
    return this._c_cont;
  }
  onRemove() {
    this._c_cont.parentNode.removeChild(this._c_cont);
    this._map = undefined;
  }
  addButton(icon, name, callback, context = undefined, {
    side_visible_default = true,
    before = undefined
  } = {}) {
    // Add side button
    const returnValue = {
      icon,
      name,
      callback,
      contexts,
      side_button: undefined,
      side_icon: undefined,
      side_checkbox: undefined,
      context_button: undefined,
      context_icon: undefined,
      context_label: undefined
    };
    if (context == undefined || context.includes("Side")) {
      const button = document.createElement("button");
      settings[`side_${name}`] = GM_getValue(`side_${name}`, side_visible_default);
      button.style.display = settings[`side_${name}`] ? "block" : "none";
      button.title = name;
      const checkbox = section$8.add_checkbox(`Show ${name}`, `side_${name}`, value => {
        button.style.display = value ? "block" : "none";
      });
      const button_icon = document.createElement("span");
      button_icon.className = "maplibregl-ctrl-icon";
      button_icon.style.backgroundImage = `url("${icon}")`;
      button_icon.style.backgroundSize = "contain";
      button.appendChild(button_icon);
      button.onclick = async () => {
        this.context = "Side";
        this.lat = vcontainer.data.currentCoords.lat;
        this.lng = vcontainer.data.currentCoords.lng;
        this.data = undefined;
        callback(this);
      };
      if (before) {
        const sibling = Array.from(this._c_cont.children).filter(el => {
          return el.title === before;
        })[0];
        sibling.insertAdjacentElement("beforebegin", button);
      } else this._c_cont.appendChild(button);
      returnValue.side_button = button;
      returnValue.side_icon = button_icon;
      returnValue.side_checkbox = checkbox;
    }
    const button = document.createElement("button");
    if (context !== undefined) {
      contexts.forEach(v => {
        if (!context.includes(v)) button.classList.add(`mmt-hide-${v.replaceAll(' ', '-')}`);
      });
    }
    const button_icon = document.createElement("span");
    button_icon.className = "maplibregl-ctrl-icon";
    button_icon.style.backgroundImage = `url("${icon}")`;
    button_icon.style.backgroundSize = "contain";
    button.appendChild(button_icon);
    const button_label = document.createElement("span");
    button_label.innerText = name;
    button.appendChild(button_label);
    button.onclick = () => {
      callback(this);
    };
    if (before) {
      const sibling = Array.from(this._m_options.children).filter(el => {
        return el.innerText === before;
      })[0];
      sibling.insertAdjacentElement("beforebegin", button);
    } else this._m_options.appendChild(button);
    returnValue.context_button = button;
    returnValue.context_icon = button_icon;
    returnValue.context_label = button_label;
    return returnValue;
  }
}

// Define map controls to add buttons for
const control = new TricksControl();
function addContext(name, available) {
  contexts.push(name);
  const css_name = name.replaceAll(' ', '-');
  Array.from(control._m_options.children).forEach(child => {
    const child_children = child.children;
    if (!available.includes(child_children[1].innerText)) {
      child.classList.add(`mmt-hide-${css_name}`);
    }
  });
  GM.addStyle(`
    #mini-map {
        .mmt-menu-${css_name} .mmt-hide-${css_name} {display: none !important;}
    }`);
}

// Add the Control to the map and set up triggers for contex menus
const ml_map$9 = vmap.data.map;
ml_map$9.addControl(control, "bottom-left");
ml_map$9.on("contextmenu", e => {
  control.openMenu("Map", e.lngLat.lat, e.lngLat.lng, e.originalEvent.clientX, e.originalEvent.clientY);
});
let longTouch = undefined;
ml_map$9.on("touchstart", () => {
  longTouch = Date.now();
});
ml_map$9.on("touchmove", () => {
  longTouch = undefined;
});
ml_map$9.on("touchend", e => {
  if (longTouch && Date.now() - longTouch > 300 && e.originalEvent.target.classList.contains("maplibregl-canvas")) {
    console.log(e);
    e.originalEvent.stopPropagation();
    e.preventDefault();
    control.openMenu("Map", e.lngLat.lat, e.lngLat.lng, e.originalEvent.changedTouches[0].clientX, e.originalEvent.changedTouches[0].clientY);
  }
  longTouch = undefined;
});
vmap.data.marker.getElement().oncontextmenu = e => {
  e.stopPropagation();
  e.preventDefault();
  control.openMenu("Car", vcontainer.data.currentCoords.lat, vcontainer.data.currentCoords.lng, e.clientX, e.clientY);
};

// Add a compass Control
const maplibre$3 = await( IRF__namespace.modules.maplibre);
const compass = new maplibre$3.NavigationControl({
  visualizePitch: true,
  visualizeRoll: true,
  showCompass: true,
  showZoom: false
});
ml_map$9.addControl(compass, "bottom-left");
compass._container.style.display = settings.side_compass ? "block" : "none";
section$8.add_checkbox("Show compass", "side_compass", show => {
  compass._container.style.display = show ? "block" : "none";
});

// Copy coordinates
control.addButton("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%22-6%20-6%2036%2036%22%20stroke-width%3D%221.5%22%20stroke%3D%22currentColor%22%20class%3D%22size-6%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M15.75%2017.25v3.375c0%20.621-.504%201.125-1.125%201.125h-9.75a1.125%201.125%200%200%201-1.125-1.125V7.875c0-.621.504-1.125%201.125-1.125H6.75a9%209%200%200%201%201.5.124m7.5%2010.376h3.375c.621%200%201.125-.504%201.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9%209%200%200%200-1.5-.124H9.375c-.621%200-1.125.504-1.125%201.125v3.5m7.5%2010.375H9.375a1.125%201.125%200%200%201-1.125-1.125v-9.25m12%206.625v-1.875a3.375%203.375%200%200%200-3.375-3.375h-1.5a1.125%201.125%200%200%201-1.125-1.125v-1.5a3.375%203.375%200%200%200-3.375-3.375H9.75%22%2F%3E%3C%2Fsvg%3E", "Copy coordinates", async c => {
  let coords;
  if (settings.coordinates_fancy) {
    coords = geoCoordinatesParser.convert(`${c.lat},${c.lng}`).toCoordinateFormat("DMS").replaceAll(" ", "").replace(",", ", ");
  } else {
    coords = `${c.lat}, ${c.lng}`;
  }
  navigator.clipboard.writeText(coords);
}, undefined, {
  side_visible_default: false
});

// Open Street View
control.addButton("https://storage.googleapis.com/support-kms-prod/SNP_E2308F5561BE1525D2C88838252137BC5634_4353424_en_v0", "Open Street View", async c => {
  const data = vcontainer.data;
  // URL pattern from https://roadtrip.pikarocks.dev/
  const url = "https://www.google.com/maps/@?api=1&map_action=pano" + `&viewpoint=${c.lat},${c.lng}` + (c.context === "Car" || c.context === "Side" ? `&pano=${data.currentPano}&heading=${data.currentHeading}` : "") + "&fov=90";
  window.open(url, "_blank");
}, undefined, {
  side_visible_default: true
});

// Open SV coverage map
control.addButton("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xml%3Aspace%3D%22preserve%22%20width%3D%22122.9%22%20height%3D%22122.9%22%3E%3Cpath%20d%3D%22M24.7%2062.4c1.8%201.6%203.6%203.2%205.4%204.6%202.4-3.6%205-7%208-10a7.2%207.2%200%200%201-.7-5.2c-3-1.9-6-4-9.2-6.4a38%2038%200%200%200-3.7%2017.3zm5.2-20.3c3.2%202.4%206.3%204.6%209.2%206.5a7.2%207.2%200%200%201%209.7-.8%2058.2%2058.2%200%200%201%2014.8-7%208%208%200%200%201%20.6-4c-4.4-3.8-9.6-7-15.6-10A37%2037%200%200%200%2029.9%2042zm23.7-16.8a75%2075%200%200%201%2012.7%208.5%208%208%200%200%201%204.6-2L72%2026a37%2037%200%200%200-18.4-.7zm21.9%202-1%205c2.4%201%204.3%203%205%205.5%203.3-.3%206.7-.3%2010.2-.1a37.7%2037.7%200%200%200-14.2-10.5zm17%2014.2c-4.5-.4-8.8-.4-12.9%200a8%208%200%200%201-2.5%204.4%2049%2049%200%200%201%206%2013.3h.8c3.3%200%206%202%207%205l7.4.2.1-3c0-7.3-2.1-14.2-5.9-20zM97.8%2068l-6.8-.1c-.6%202.8-2.8%205-5.6%205.6.1%203.3%200%206.9-.4%2010.6%202-.2%204.2-.5%206.3-1%203.3-4.3%205.5-9.5%206.5-15.1zm-4.4%2018.4a40.5%2040.5%200%200%201-32%2015.6A40.5%2040.5%200%200%201%2021%2061.4%2040.5%2040.5%200%200%201%2061.4%2021%2040.5%2040.5%200%200%201%20102%2061.4a40%2040%200%200%201-8.6%2025zm-5.7%201-3.1.4-.5%202.8%203.5-3zm-7.8%206%201-5.4c-6.6.4-13%200-19.1-1.4a6.5%206.5%200%200%201-5.4%202.3L53%2097.5c2.7.6%205.5%201%208.3%201v-.1c6.8%200%2013-1.8%2018.5-5zm-30.3%203%203.4-8.7a6.5%206.5%200%200%201-2.7-4.5%2086%2086%200%200%201-19.2-10.9l-3%205.3a37.1%2037.1%200%200%200%2021.5%2018.9zM26.4%2073.3l1.8-3.1-3.2-2.6c.3%202%20.8%203.9%201.4%205.7zM51%2050.7a7.2%207.2%200%200%201%20.4%204.9c4%201.9%207.9%203.4%2011.8%204.6a261%20261%200%200%200%204.1-13.5c-1-.6-1.8-1.5-2.5-2.5A55.5%2055.5%200%200%200%2051%2050.7zm-1.5%208a7.2%207.2%200%200%201-9%201c-2.7%202.8-5.2%206-7.5%209.5a83.2%2083.2%200%200%200%2018%2010.3%206.5%206.5%200%200%201%206.5-3.6c1.6-4%203-8%204.5-12.3a85.6%2085.6%200%200%201-12.5-4.9zm24.4-11a8.1%208.1%200%200%201-3.1.2l-4%2013.3c3.4.8%207%201.5%2010.6%202%20.6-1.1%201.4-2%202.4-2.7a46.8%2046.8%200%200%200-5.9-12.8zm7.8%2025.6a7.2%207.2%200%200%201-5-6.6c-3.8-.5-7.5-1.2-11.1-2a419%20419%200%200%201-4.7%2012.6%206.5%206.5%200%200%201%202.4%206%2070.3%2070.3%200%200%200%2018%201c.4-3.8.6-7.5.4-11z%22%20style%3D%22fill%3A%235fbdff%3Bfill-opacity%3A1%3Bstroke-width%3A.660746%22%2F%3E%3C%2Fsvg%3E", "Open SV coverage map", async c => {
  const url = "https://sv-map.netlify.app/#base=roadmap&cov=all&" + `panos=&zoom=${vmap.data.map.getZoom() + 1}&center=${c.lat}%2C${c.lng}`;
  window.open(url, "_blank");
}, undefined, {
  side_visible_default: false
});

const mapContainerEl$2 = await( IRF__namespace.dom.map);
const event = new CustomEvent("toggleFullscreenMap");

// Implement toggling fullscreen mode
let getPanoUrlOverriden = false;
let mapIsFullscreen = false;
let changeStopArgs = undefined;
function toggleMapFullscreen(fullscreen) {
  mapIsFullscreen = mapContainerEl$2.classList.toggle("fullscreen", fullscreen);
  mapContainerEl$2.dispatchEvent(event);
  if (mapIsFullscreen) changeStopArgs = undefined;
  if (!mapIsFullscreen && changeStopArgs && vcontainer.data.endTime - Date.now() > 2000) vcontainer.methods.changeStop.apply(null, changeStopArgs);
  if (!getPanoUrlOverriden) {
    vcontainer.state.getPanoUrl = new Proxy(vcontainer.methods.getPanoUrl, {
      apply: (target, thisArg, args) => {
        if (mapIsFullscreen) return "about:blank";
        return Reflect.apply(target, thisArg, args);
      }
    });
    getPanoUrlOverriden = true;
  }
}

// Save changeStop arguments for use when exiting fullscreen
const changeStop$1 = vcontainer.methods.changeStop;
vcontainer.state.changeStop = new Proxy(changeStop$1, {
  apply: (target, thisArg, args) => {
    changeStopArgs = args;
    return Reflect.apply(target, thisArg, args);
  }
});

// Add a button to the context menu
const fullscreen_icon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-6 -6 36 36" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/></svg>`;
control.addButton(`data:image/svg+xml,${encodeURIComponent(fullscreen_icon)}`, "Fullscreen map", () => toggleMapFullscreen(), ["Side", "Map"], {
  side_visible_default: true
});

// Add a button on mobile that lets you jump into the fullscreen map
// from the main game view
const fs_mobile = document.createElement("div");
mapContainerEl$2.appendChild(fs_mobile);
fs_mobile.id = "mmt-mobile-fs";
fs_mobile.classList.add("mobile-expand-button");
fs_mobile.dataset["v-89a7e684"] = "";
fs_mobile.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(fullscreen_icon)}")`;
fs_mobile.addEventListener("click", () => toggleMapFullscreen());

// Go into fullscreen if #map is the window hash
if (window.location.hash === "#map") toggleMapFullscreen(true);

const trash_svg = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.5" class="size-6" viewBox="-6 -6 36 36"><path stroke-linecap="round" stroke-linejoin="round" d="m14.7 9-.3 9m-4.8 0-.3-9m10-3.2 1 .2m-1-.2-1.1 13.9a2.3 2.3 0 0 1-2.3 2H8.1a2.3 2.3 0 0 1-2.3-2l-1-14m14.4 0a48.1 48.1 0 0 0-3.4-.3M3.8 6l1-.2m0 0a48.1 48.1 0 0 1 3.5-.4m7.5 0v-1c0-1.1-1-2-2.1-2.1a52 52 0 0 0-3.4 0c-1.1 0-2 1-2 2.2v.9m7.5 0a48.7 48.7 0 0 0-7.5 0"/></svg>';
const ml_map$8 = vmap.data.map;

// Code for measuring distance is heavily rewritten adapted into OOP from
// https://maplibre.org/maplibre-gl-js/docs/examples/measure/

// This object handles the abstract measuring functions
class Measure {
  constructor() {
    // GeoJSON object to hold our measurement features - points and a line
    this.geojson_points = {
      'type': 'FeatureCollection',
      'features': []
    };
    this.geojson_line = {
      'type': 'FeatureCollection',
      'features': []
    };
    // Feature to draw the line between points
    this.linestring = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: []
      },
      properties: {}
    };
    this.car = undefined;
  }
  toggleCar() {
    if (this.car) {
      this.removePoint(this.car);
      this.car = undefined;
    } else {
      this.addPoint(vcontainer.data.currentCoords.lat, vcontainer.data.currentCoords.lng);
      this.car = this.geojson_points.features[this.geojson_points.features.length - 1].properties.id;
    }
  }
  updateCar() {
    if (!this.car) return;
    const coords = [vcontainer.data.currentCoords.lng, vcontainer.data.currentCoords.lat];
    this.geojson_points.features.forEach(point => {
      if (point.properties.id == this.car) point.geometry.coordinates = coords;else if (turf.distance(point.geometry.coordinates, coords) < 0.05) {
        this.removePoint(point.properties.id);
      }
    });
    this._updatePoints();
  }

  // Compute and display the distance determined by the line
  setDistance() {
    const unit = vodometer.data.isKilometers ? "km" : "mi";
    const conversion = vodometer.data.isKilometers ? 1 : vodometer.data.conversionFactor;
    let distance = turf.length(this.linestring);
    // Assuming 10km/h
    const time_est = distance / 10;
    distance = distance / conversion;
    distance_control.dist_cont.innerText = `${distance.toFixed(3)} ${unit}`;
    distance_control.dist_cont.title = `~ ${Math.floor(time_est)}h ${Math.round(time_est % 1 * 60)}min (10km/h)`;
  }

  // Update the line based on the points
  _recomputeLine() {
    this.linestring.geometry.coordinates = this.geojson_points.features.map(point => {
      return point.geometry.coordinates;
    });
    this.geojson_line.features = [this.linestring];
    ml_map$8.getSource('geojson_line').setData(this.geojson_line);
  }

  // Update the points data on the map (and the distance based on that)
  _updatePoints() {
    this._recomputeLine();
    ml_map$8.getSource('geojson_points').setData(this.geojson_points);
    this.setDistance();
  }

  // Remove all points
  clearPoints() {
    this.geojson_points.features = [];
    this._updatePoints();
    this.car = undefined;
  }

  // Add a point at lat, lng
  addPoint(lat, lng) {
    const point = {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [lng, lat]
      },
      'properties': {
        'id': String(new Date().getTime())
      }
    };
    this.geojson_points.features.push(point);
    this._updatePoints();
  }

  // Remove a point with a given feature id
  removePoint(id) {
    this.geojson_points.features = this.geojson_points.features.filter(point => {
      return point.properties.id !== id;
    });
    this._updatePoints();
  }
  async flyTo() {
    ml_map$8.fitBounds(await ml_map$8.getSource('geojson_points').getBounds(), {
      padding: 50
    });
  }
}
const measure = new Measure();
class DistanceControl {
  // Control container

  constructor() {
    this._c_cont = document.createElement('div'); // Control container
    this._c_cont.style.display = "none";
    this._c_cont.className = 'maplibregl-ctrl maplibregl-ctrl-group mmt-distance-control';
    const check_cont = document.createElement("div");
    this._c_cont.appendChild(check_cont);
    const check = document.createElement("input");
    check.title = "Enable line editing";
    check.type = "checkbox";
    check_cont.appendChild(check);
    this.check = check;
    const dist_cont = document.createElement("div");
    dist_cont.style.cursor = "pointer";
    dist_cont.onclick = () => {
      measure.flyTo();
    };
    dist_cont.innerText = "0 km";
    this._c_cont.appendChild(dist_cont);
    this.dist_cont = dist_cont;
    const trash_button = document.createElement("button");
    trash_button.title = "Discard and finish measuring";
    trash_button.onclick = () => {
      this.endMeasure();
    };
    this._c_cont.appendChild(trash_button);
    this.trash_button = trash_button;
    const button_icon = document.createElement("span");
    button_icon.className = "maplibregl-ctrl-icon";
    button_icon.style.backgroundImage = `url(data:image/svg+xml,${encodeURIComponent(trash_svg)})`;
    button_icon.style.backgroundSize = "contain";
    trash_button.appendChild(button_icon);
  }
  onAdd(map) {
    this._map = map;
    return this._c_cont;
  }
  onRemove() {
    this._c_cont.parentNode.removeChild(this._c_cont);
    this._map = undefined;
  }
  startMeasure() {
    measure.clearPoints();
    this.check.checked = true;
    this._c_cont.style.display = "flex";
  }
  endMeasure() {
    measure.clearPoints();
    this.check.checked = false;
    this._c_cont.style.display = "none";
  }
}
const distance_control = new DistanceControl();
ml_map$8.addControl(distance_control, "top-left");
ml_map$8.once("load", () => {
  // Add the two data sources
  ml_map$8.addSource('geojson_line', {
    'type': 'geojson',
    'data': measure.geojson_line
  });
  ml_map$8.addSource('geojson_points', {
    'type': 'geojson',
    'data': measure.geojson_points
  });

  // Add layers and styles to the map
  ml_map$8.addLayer({
    id: 'measure-lines',
    type: 'line',
    source: 'geojson_line',
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    paint: {
      'line-color': '#0009',
      'line-width': 2.5
    }
  });
  ml_map$8.addLayer({
    id: 'measure-points',
    type: 'circle',
    source: 'geojson_points',
    paint: {
      'circle-radius': 5,
      'circle-color': '#000b'
    }
  });
  ml_map$8.moveLayer("measure-lines");
  ml_map$8.moveLayer("measure-points");

  // Handle clicking
  ml_map$8.on('click', e => {
    // Only interact with the measurements if the checkbox is ticked
    if (!distance_control.check.checked) return;

    // Did the user click any features?
    const features = ml_map$8.queryRenderedFeatures(e.point, {
      layers: ['measure-points']
    });
    if (features.length) {
      // Remove the clicked point
      measure.removePoint(features[0].properties.id);
    } else {
      // Add a new point
      measure.addPoint(e.lngLat.lat, e.lngLat.lng);
    }
  });
  vmap.data.marker.getElement().addEventListener("click", e => {
    if (!distance_control.check.checked) return;
    measure.toggleCar();
    e.stopPropagation();
  });

  // Update the cursor as it moves over our new features
  ml_map$8.on('mousemove', e => {
    if (!distance_control.check.checked) {
      // If we're not editing the measurements, stick to the default grab
      ml_map$8.getCanvas().style.cursor = "grab";
    } else {
      const features = ml_map$8.queryRenderedFeatures(e.point, {
        layers: ['measure-points']
      });
      // Pointer if hovering over a point, crosshair otherwise
      ml_map$8.getCanvas().style.cursor = features.length ? 'pointer' : 'crosshair';
    }
  });
});

// Add context menu option
const ruler_icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-200 -1160 1360 1360"><path d="M200-160v-340q0-142 99-241t241-99q142 0 241 99t99 241q0 142-99 241t-241 99H200Zm80-80h260q108 0 184-76t76-184q0-108-76-184t-184-76q-108 0-184 76t-76 184v260Zm260-120q58 0 99-41t41-99q0-58-41-99t-99-41q-58 0-99 41t-41 99q0 58 41 99t99 41Zm0-80q-25 0-42.5-17.5T480-500q0-25 17.5-42.5T540-560q25 0 42.5 17.5T600-500q0 25-17.5 42.5T540-440ZM80-160v-200h80v200H80Zm460-340Z"/></svg>';
control.addButton(`data:image/svg+xml,${encodeURIComponent(ruler_icon)}`, "Measure distance", async c => {
  distance_control.startMeasure();
  if (c.context === "Car") measure.toggleCar();else if (c.context !== "Side") measure.addPoint(c.lat, c.lng);
}, undefined, {
  side_visible_default: false,
  before: "Open Street View"
});

const section$7 = panel.add_section("Map position", `The map will follow the car by default.
    You can change how (and if) this happens here.`);
section$7.add_checkbox("Re-centre map on the car after a timeout", "timeout_centre");
section$7.add_checkbox("Disable re-centring when map is in fullscreen", "timeout_centre_fullscreen_disable");
section$7.add_checkbox("Align map orientation with the car", "align_orientation");
section$7.add_checkbox("Snap the map to locations instead of animating", "disable_flying_animations");
section$7.add_checkbox("Reset zoom when the map re-centres", "reset_zoom");
section$7.add_checkbox("Disable fly-in animation on load", "disable_fly_in");
section$7.add_slider("Default map zoom", "default_zoom");
const ml_map$7 = vmap.data.map;

// First flight will always want to be to the default zoom level
// So we need to figure out if said first flight has been achieved
let first_fly = true;
const zoom_subscription = ml_map$7.on("moveend", () => {
  if (Math.abs(ml_map$7.getZoom() - settings.default_zoom) < 0.2) {
    first_fly = false;
    zoom_subscription.unsubscribe();
  }
});

// General function for flying the map to a location
let latestBearing = 0;
function flyTo(coords, bearing, interactionOverride = true) {
  const args = {
    essential: true,
    animate: !(settings.disable_flying_animations || first_fly && settings.disable_fly_in)
  };
  if (coords) {
    args.center = [coords[1], coords[0]];
  }
  if (bearing) {
    args.bearing = bearing;
    latestBearing = bearing;
  } else if (settings.align_orientation) {
    args.bearing = latestBearing;
  }
  if (first_fly || settings.reset_zoom) {
    args.zoom = settings.default_zoom;
  }
  ml_map$7.flyTo(args, {
    interactionOverride: interactionOverride
  });
}

// Disable the default map reset function
// so we can implement our own logic for when this should happen
vmap.state.flyTo = new Proxy(vmap.methods.flyTo, {
  apply: () => {}
});

// Proxy the user interaction handling to not include flyTo calls
// that have the interactionOverride flag
ml_map$7.off("dragstart", vmap.methods.handleUserInteraction);
ml_map$7.off("zoomstart", vmap.methods.handleUserInteraction);
vmap.state.handleUserInteraction = new Proxy(vmap.methods.handleUserInteraction, {
  apply: (target, thisArg, args) => {
    var _args$;
    if (!((_args$ = args[0]) != null && _args$.interactionOverride)) {
      return Reflect.apply(target, thisArg, args);
    }
  }
});
// Rebind event handlers so that they use the proxied method
ml_map$7.on("dragstart", vmap.methods.handleUserInteraction);
ml_map$7.on("zoomstart", vmap.methods.handleUserInteraction);
ml_map$7.on("rotatestart", vmap.methods.handleUserInteraction);
function checkUpdateMap() {
  return Date.now() - vmap.data.lastUserInteraction > 30000 && (settings.timeout_centre && (!mapIsFullscreen || !settings.timeout_centre_fullscreen_disable) || vmap.data.lastUserInteraction == 0);
}
let prevPos = [0, 0];
vmap.data.marker.setLngLat = new Proxy(vmap.data.marker.setLngLat, {
  apply: (target, thisArg, args) => {
    // Sync map to the coordinates when the marker is updated
    // but only if the marker moved a significant distance compared to the tile size
    const map_lnglat = ml_map$7.getCenter();
    const diff = [Math.abs(args[0][0] - map_lnglat.lng), Math.abs(args[0][1] - map_lnglat.lat)];
    const tile_width = 360 / 2 ** ml_map$7.getZoom();
    const factor = 0.01;
    if ((diff[0] > tile_width * factor || diff[1] > tile_width * factor) && checkUpdateMap()) {
      flyTo([args[0][1], args[0][0]]);
    }

    // Update the distance measurement when the car's position changes
    // (this method is called on every websocket receive, so we filter it here)
    if (args[0][0] !== prevPos[0] || args[0][1] !== prevPos[1]) {
      measure.updateCar();
      prevPos = args[0];
    }
    return Reflect.apply(target, thisArg, args);
  }
});

// Add button for re-centring
control.addButton("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='29' height='29' fill='%23333' viewBox='0 0 20 20'%3E%3Cpath d='M10 4C9 4 9 5 9 5v.1A5 5 0 0 0 5.1 9H5s-1 0-1 1 1 1 1 1h.1A5 5 0 0 0 9 14.9v.1s0 1 1 1 1-1 1-1v-.1a5 5 0 0 0 3.9-3.9h.1s1 0 1-1-1-1-1-1h-.1A5 5 0 0 0 11 5.1V5s0-1-1-1m0 2.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 1 1 0-7'/%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3C/svg%3E", "Centre", async c => {
  flyTo([c.lat, c.lng], settings.align_orientation && (c.context === "Side" || c.context === "Car") ? vcontainer.data.currentHeading : undefined);
  if (c.context === "Side" || c.context === "Car") {
    vmap.state.lastUserInteraction = 0;
  }
}, ["Side", "Car", "Marker"]);

const maplibre$2 = await( IRF__namespace.modules.maplibre);
const ml_map$6 = vmap.data.map;

// In memory marker storage
const markers = {};
class MMTMarker extends maplibre$2.Marker {
  _mmt_remove() {
    delete settings.markers[this._mmt_id];
    delete markers[this._mmt_id];
    GM.setValues(settings);
    this.remove();
  }
}
async function add_marker(lat, lng, marker_id, color) {
  color = color ? color : settings.marker_color;
  const marker = new MMTMarker({
    draggable: settings.draggable_markers,
    scale: 0.8,
    color: color
  }).setLngLat([lng, lat]).addTo(ml_map$6);
  if (!marker_id) {
    marker_id = crypto.randomUUID();
    settings.markers[marker_id] = [lat, lng, {
      color
    }];
    GM.setValues(settings);
  }
  marker._mmt_id = marker_id;
  markers[marker_id] = marker;
  marker.on("dragend", () => {
    const lngLat = marker.getLngLat();
    settings.markers[marker_id][0] = lngLat.lat;
    settings.markers[marker_id][1] = lngLat.lng;
    GM.setValues(settings);
  });
  marker.getElement().addEventListener("contextmenu", f => {
    f.stopPropagation();
    f.preventDefault();
    const colour = marker.getElement().children[0].children[0].children[1].getAttribute("fill");
    mcol_input.value = colour;
    const lngLat = marker.getLngLat();
    control.openMenu("Marker", lngLat.lat, lngLat.lng, f.clientX, f.clientY, marker);
  });
}

// Add the markers from extension storage
for (const [marker_id, value] of Object.entries(settings.markers)) {
  add_marker(value[0], value[1], marker_id, value[2].color);
}

// Basic context menu options
const marker_icon_base = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%22-5%20-6%2037%2036%22%20stroke-width%3D%221.5%22%20stroke%3D%22currentColor%22%20class%3D%22size-6%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M15%2010.5a3%203%200%201%201-6%200%203%203%200%200%201%206%200%22%2F%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19.5%2010.5c0%207.142-7.5%2011.25-7.5%2011.25S4.5%2017.642%204.5%2010.5a7.5%207.5%200%201%201%2015%200%22%2F%3E";
control.addButton(marker_icon_base + "%3Cpath%20d%3D%22M19%2021h8m-4-4v8%22%2F%3E%3C%2Fsvg%3E", "Add marker", async c => {
  add_marker(c.lat, c.lng);
}, ["Side", "Car", "Map"], {
  side_visible_default: false,
  before: "Centre"
});
control.addButton(marker_icon_base + "%3Cpath%20d%3D%22M20%2018l6%206m-6%200l6%20-6%22%2F%3E%3C%2Fsvg%3E", "Remove marker", async c => {
  c.data._mmt_remove();
}, ["Marker"]);

// Mark given coordinates
control.addButton("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%22-6%20-6%2036%2036%22%20stroke-width%3D%221.5%22%20stroke%3D%22currentColor%22%20class%3D%22size-6%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M6%2012%203.269%203.125A59.8%2059.8%200%200%201%2021.485%2012%2059.8%2059.8%200%200%201%203.27%2020.875L5.999%2012Zm0%200h7.5%22%2F%3E%3C%2Fsvg%3E", "Go to and mark coordinates", async () => {
  let converted;
  try {
    converted = geoCoordinatesParser.convert(prompt("Input coordinates here:"));
  } catch (_unused) {
    alert("Coordinates were incorrect!");
    return;
  }
  add_marker(converted.decimalLatitude, converted.decimalLongitude);
  flyTo([converted.decimalLatitude, converted.decimalLongitude], undefined, false);
}, ["Side", "Map"], {
  side_visible_default: false,
  before: "Copy coordinates"
});

// Draggable markers
const draggable_meta = control.addButton("", "Draggable markers", () => {
  settings.draggable_markers = !settings.draggable_markers;
  GM.setValues(settings);
  draggable_checkbox.checked = settings.draggable_markers;
  for (const [, marker] of Object.entries(markers)) {
    marker.setDraggable(settings.draggable_markers);
  }
}, ["Marker"], {
  before: "Remove marker"
});
const draggable_checkbox = document.createElement("input");
draggable_checkbox.type = "checkbox";
draggable_checkbox.checked = settings.draggable_markers;
draggable_meta.context_icon.appendChild(draggable_checkbox);
draggable_meta.context_icon.classList.add("mmt-draggable-checkbox-icon");

// Marker colour
const dropper_svg = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-6 -6 36 36" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m15 11.25 1.5 1.5.75-.75V8.758l2.276-.61a3 3 0 1 0-3.675-3.675l-.61 2.277H12l-.75.75 1.5 1.5M15 11.25l-8.47 8.47c-.34.34-.8.53-1.28.53s-.94.19-1.28.53l-.97.97-.75-.75.97-.97c.34-.34.53-.8.53-1.28s.19-.94.53-1.28L12.75 9M15 11.25 12.75 9"/></svg>';
control.addButton(`data:image/svg+xml,${encodeURIComponent(dropper_svg)}`, "Set color", () => {
  mcol_input.click();
}, ["Marker"], {
  before: "Remove marker"
});
const mcol_input = document.createElement("input");
mcol_input.type = "color";
mcol_input.id = "mmt-menu-color";
mcol_input.addEventListener("input", () => {
  if (control.data) {
    control.data.getElement().children[0].children[0].children[1].setAttribute("fill", mcol_input.value);
    settings.markers[control.data._mmt_id][2].color = mcol_input.value;
    GM.setValues(settings);
  }
});

// Marker settings
const section$6 = marker_panel.add_section("User markers", `You can add and remove
    your own markers by right-clicking the minimap.`);
section$6.add_input("Default marker colour", "marker_color", "color", undefined, "#f7a000");
section$6.add_button("Remove all markers", () => {
  for (const [, marker] of Object.entries(markers)) {
    marker._mmt_remove();
  }
});

const section$5 = panel.add_section("Measurements and units", `Do you prefer metric? (correct) Or would you like more precision?`);
const ml_map$5 = await( vmap.data.map);
const maplibre$1 = await( IRF__namespace.modules.maplibre);
const odometer_el = await( IRF__namespace.dom.odometer);

// Add a scale bar
const scale_control = new maplibre$1.ScaleControl({
  unit: vodometer.data.isKilometers ? "metric" : "imperial"
});
ml_map$5.addControl(scale_control, "bottom-right");
scale_control._container.style.margin = "0px 36px 5px 0px";
scale_control._container.style.display = settings.show_scale ? "block" : "none";

// Sync the scale bar units to the odometer
// Get the original setter
const {
  set: isKilometersSetter
} = Object.getOwnPropertyDescriptor(vodometer.state, 'isKilometers');
// Override the setter
Object.defineProperty(vodometer.state, 'isKilometers', {
  set(isKilometers) {
    const r_value = isKilometersSetter.call(this, isKilometers);
    // Set the units on the scale bar
    scale_control.setUnit(isKilometers ? "metric" : "imperial");
    // Update the units on the distance measurement
    measure.setDistance();
    return r_value;
  },
  configurable: true,
  enumerable: true
});

// Add a settings checkbox for showing the scale bar
section$5.add_checkbox("Show map scale", "show_scale", show => {
  scale_control._container.style.display = show ? "block" : "none";
});

// Default to kilometres if desired
if (settings.km_units) {
  vodometer.state.isKilometers = true;
}
section$5.add_checkbox("Default to metric units", "km_units", async value => {
  vodometer.state.isKilometers = value;
});

// Display decimal points if desired
const decimal_el = document.createElement("span");
const units_el = odometer_el.getElementsByClassName("miles-text")[0];
decimal_el.style.display = "none";
units_el.appendChild(decimal_el);
vcontainer.state.updateData = new Proxy(vcontainer.methods.updateData, {
  apply: (target, thisArg, args) => {
    // debugger;
    let distance = args[0]["distance"];
    if (vodometer.data.isKilometers) {
      distance *= vodometer.data.conversionFactor;
    }
    const decimals = ((distance % 1 + 1) * 100).toString().substring(1, 3);
    decimal_el.innerHTML = `<br>.${decimals}`;
    return Reflect.apply(target, thisArg, args);
  }
});
section$5.add_checkbox("Show decimals in distance", "decimal_units", async value => {
  if (value) {
    odometer_el.classList.toggle("mmt-miles-decimal", true);
  } else {
    odometer_el.classList.toggle("mmt-miles-decimal", false);
  }
});
odometer_el.classList.toggle("mmt-miles-decimal", settings.decimal_units);

// This setting gets used by "copy coordinates"
section$5.add_checkbox("Use minutes and seconds when copying coordinates", "coordinates_fancy");

const ml_map$4 = vmap.data.map;
const car_marker = vmap.data.marker;
const marker_el = vmap.data.marker.getElement();

// Correct car marker offset (it's a little off-centre by default)
function default_marker_svg() {
  return 'url("data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20101%20245%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xml%3Aspace%3D%22preserve%22%20style%3D%22fill-rule%3Aevenodd%3Bclip-rule%3Aevenodd%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3Bstroke-miterlimit%3A1.5%22%3E%3Cg%20transform%3D%22translate(-118.117%20-1517)%22%3E%3Cpath%20d%3D%22M219%201598h-88.922l22.231-94h44.461z%22%20style%3D%22fill%3Aurl(%23a)%22%20transform%3D%22matrix(-1.13495%200%200%20-1.05851%20366.671%203208.5)%22%2F%3E' + (settings.car_marker_custom ? '' : '%3Ccircle%20cx%3D%22168.578%22%20cy%3D%221636.5%22%20r%3D%2238.5%22%20style%3D%22fill%3A%2300a6ff%3Bstroke%3A%23fff%3Bstroke-width%3A8.33px%22%2F%3E') + '%3C%2Fg%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22a%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%220%22%20gradientUnits%3D%22userSpaceOnUse%22%20gradientTransform%3D%22matrix(0%2094%20-114%200%20174.539%201504)%22%3E%3Cstop%20offset%3D%220%22%20style%3D%22stop-color%3A%2300a6ff%3Bstop-opacity%3A.77%22%2F%3E%3Cstop%20offset%3D%221%22%20style%3D%22stop-color%3A%2300a6ff%3Bstop-opacity%3A0%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3C%2Fsvg%3E")';
}
marker_el.style.backgroundImage = default_marker_svg();
marker_el.style.width = `${settings.car_marker_size}px`;
marker_el.style.height = `${settings.car_marker_size}px`;
marker_el.style.setProperty('--marker-opacity', settings.marker_opacity.toString());

// Custom car marker
const custom_car = document.createElement("img");
custom_car.src = settings.car_marker_url;
custom_car.style.maxWidth = `${settings.car_marker_scale}%`;
custom_car.style.maxHeight = `${settings.car_marker_scale}%`;
custom_car.style.rotate = `${settings.car_marker_rotation}deg`;
custom_car.style.display = settings.car_marker_custom ? "block" : "none";
marker_el.appendChild(custom_car);

// Set the marker rotation when the car moves
const changeStop = vcontainer.methods.changeStop;
vcontainer.state.changeStop = new Proxy(changeStop, {
  apply: (target, thisArg, args) => {
    const returnValue = Reflect.apply(target, thisArg, args);
    car_marker.setRotation(args[3]);
    if (checkUpdateMap() && settings.align_orientation && Math.abs(ml_map$4.getBearing() - args[3]) % 360 > 1) flyTo(undefined, args[3]);
    const x_flip = settings.car_marker_flip ? "-1" : "1";
    if (settings.car_marker_flip_x && args[3] > 180) {
      custom_car.style.transform = `scale(${x_flip}, -1)`;
    } else {
      custom_car.style.transform = `scale(${x_flip}, 1)`;
    }
    return returnValue;
  }
});
// Set the rotation on load
if (vcontainer.data.currentHeading) car_marker.setRotation(vcontainer.data.currentHeading);
// Override the normal marker rotation setting method, we do it above!
vmap.state.setMarkerRotation = new Proxy(vmap.methods.setMarkerRotation, {
  apply: () => {}
});

// Settings
const section$4 = panel.add_section("Car marker", `You can set the car marker on the map to be
    any custom image, or change the appearance of the default marker too.`);
section$4.add_slider("Car marker opacity", "marker_opacity", value => {
  marker_el.style.setProperty('--marker-opacity', value);
}, [0, 1, 0.05]);
section$4.add_slider("Car marker size (px)", "car_marker_size", value => {
  marker_el.style.width = `${value}px`;
  marker_el.style.height = `${value}px`;
}, [20, 100, 1]);
section$4.add_checkbox("Custom car marker", "car_marker_custom", show => {
  custom_car.style.display = show ? "block" : "none";
  marker_el.style.backgroundImage = default_marker_svg();
});
section$4.add_input("Car marker image URL", "car_marker_url", "", () => custom_car.src = settings.car_marker_url, "https://jdranczewski.dev/irt/images/white_van.png");
section$4.add_comment(`Default white van picture:
    <a href='https://www.vecteezy.com/free-png/2d-delivery-truck-top-view' target='_blank'>
    2d Delivery Truck Top View PNGs by Vecteezy</a>.
    You can upload your custom image to <a href='https://catbox.moe' target='_blank'>catbox.moe</a>
    to get an image URL.`);
section$4.add_slider("Custom car marker scale (%)", "car_marker_scale", value => {
  custom_car.style.maxWidth = `${value}%`;
  custom_car.style.maxHeight = `${value}%`;
}, [0, 100, 1]);
section$4.add_slider("Custom car marker rotation (deg)", "car_marker_rotation", value => {
  custom_car.style.rotate = `${value}deg`;
}, [0, 360, 5]);
section$4.add_checkbox("Flip custom image", "car_marker_flip");
section$4.add_checkbox("Flip image when going left", "car_marker_flip_x");

const ml_map$3 = vmap.data.map;
const mapContainerEl$1 = await( IRF__namespace.dom.map);
const miniMapEl = mapContainerEl$1.querySelector('#mini-map');
const expandButtonEl = mapContainerEl$1.querySelector('.expand-button');

// Automatically expand the map
if (window.innerWidth > 900 && settings.expand_map) {
  vmap.state.isExpanded = true;
}

// Set the variables for map resizing if not undefined
function setMiniMapSize({
  width,
  height,
  expanded_width,
  expanded_height
}) {
  miniMapEl.style.setProperty('--map-width', width ? `${Math.min(Math.max(0, width), 90)}vw` : "");
  miniMapEl.style.setProperty('--map-height', height ? `${Math.min(Math.max(0, height), 90)}vh` : "");
  miniMapEl.style.setProperty('--map-width-expanded', expanded_width ? `${Math.min(Math.max(0, expanded_width), 90)}vw` : "");
  miniMapEl.style.setProperty('--map-height-expanded', expanded_height ? `${Math.min(Math.max(0, expanded_height), 90)}vh` : "");
}

// Set initial map size and resize oncee the css properties are applied
setMiniMapSize(settings.map_size);
requestAnimationFrame(() => {
  ml_map$3.resize();
});

// Drag to resize
let isClicked = false; // Clicked determines if we should be listening to mousemove
let isResizing = false; // Resizing determines if the expanded state should be switched
let lastX, lastY;

// Start the drag
expandButtonEl.addEventListener('pointerdown', e => {
  isClicked = true;
  lastX = e.clientX;
  lastY = e.clientY;
  e.preventDefault();
});

// Continue the drag
document.addEventListener('pointermove', e => {
  if (!isClicked) return;
  if (e.buttons == 0) {
    isClicked = false;
    isResizing = false;
    return;
  }
  const deltaX = e.clientX - lastX;
  const deltaY = e.clientY - lastY;

  // Set the resizing flag if we moved
  // The call to switch expanded state will then not be sent
  isResizing = true;
  const currentSizePx = {
    width: miniMapEl.offsetWidth,
    height: miniMapEl.offsetHeight
  };
  const e_mod = mapContainerEl$1.classList.contains("expanded") ? "expanded_" : "";
  settings.map_size[e_mod + "width"] = (currentSizePx.width + deltaX) / window.innerWidth * 100;
  settings.map_size[e_mod + "height"] = (currentSizePx.height - deltaY) / window.innerHeight * 100;
  setMiniMapSize(settings.map_size);
  GM.setValues(settings);
  lastX = e.clientX;
  lastY = e.clientY;
});

// End drag
document.addEventListener('pointerup', () => {
  isClicked = false;
});

// Overriding the isExpanded setter, as overriding toggleExpand doesn't seem to work
// the first time it's called. We want to prevent this variable from being flipped if
// the map is being resized (and the game will try to flip it when the mouse is released).
const {
  set: isExpandedSetter
} = Object.getOwnPropertyDescriptor(vmap.state, 'isExpanded');
Object.defineProperty(vmap.state, 'isExpanded', {
  set(isExpanded) {
    if (isResizing) {
      isResizing = false;
      return isExpandedSetter.call(this, !isExpanded);
    }
    return isExpandedSetter.call(this, isExpanded);
  },
  configurable: true,
  enumerable: true
});

// Settings
const section$3 = panel.add_section("Map size", `You can drag the "expand"
    button of the map to change its size, and you can save two different sizes this way
    - expanded and not expanded. Click the "expand" button to toggle between these.`);
section$3.add_button("Reset map size", () => {
  settings.map_size = {
    width: undefined,
    height: undefined,
    expanded_width: undefined,
    expanded_height: undefined
  };
  GM.setValues(settings);
  setMiniMapSize(settings.map_size);
});
section$3.add_checkbox("Expand the map by default", "expand_map");

const section$2 = panel.add_section("Map appearance", `Change the opacity of
    map elements here. You can use the sliders below to make the map mostly transparent,
    or even set it so that only the streets are visible unless you put your mouse over it!`);
const ml_map$2 = vmap.data.map;
const mapContainerEl = await( IRF__namespace.dom.map);

// Map background layer opacity
function setLayerOpacity(value = undefined) {
  if (!value) {
    value = vmap.data.isExpanded ? settings.background_opacity_expanded : settings.background_opacity;
    if (mapIsFullscreen) value = 1;
  }
  value = parseFloat(value);
  ml_map$2.setPaintProperty("background", "background-opacity", value);
  ml_map$2.setPaintProperty("water", "fill-opacity", value);
}
// Hide the menu and change background opacities when netux's PIP exits/enters
let inPIP = false;
if (window.documentPictureInPicture) {
  window.documentPictureInPicture.addEventListener("enter", e => {
    setLayerOpacity(1);
    inPIP = true;
    e.window.addEventListener("pagehide", () => {
      control._hide_menu();
      setLayerOpacity();
      inPIP = false;
    });
  });
}

// Map element opacity
mapContainerEl.style.opacity = settings.map_opacity;
mapContainerEl.style.setProperty('--map-opacity-expanded', settings.map_opacity_expanded);

// Set the route opacity
ml_map$2.once('load', () => {
  // Messing with styles should only happen once map is ready
  ml_map$2.setPaintProperty("route", "line-opacity", parseFloat(settings.route_opacity));
  setLayerOpacity();

  // Full layer opacity when mouse over the map
  mapContainerEl.addEventListener("mouseenter", () => {
    if (inPIP || mapIsFullscreen) return;
    setLayerOpacity(1);
  });
  mapContainerEl.addEventListener("mouseleave", () => {
    if (inPIP || mapIsFullscreen) return;
    setLayerOpacity();
  });
});

// Full opacity when map is in fullscreen
mapContainerEl.addEventListener("toggleFullscreenMap", () => {
  setLayerOpacity(mapIsFullscreen ? 1 : undefined);
});

// Set the old route opacity once it's added
const old_route_subscription = ml_map$2.on("data", e => {
  if (e.sourceId == "old-route") {
    ml_map$2.setPaintProperty("old-route-layer", "line-opacity", parseFloat(settings.route_opacity));
    ml_map$2.moveLayer("route", "boundary_3");
    ml_map$2.moveLayer("old-route-layer", "route");
    // Move map history honks below town names, so that the names are shown with priority
    if (ml_map$2.getLayer("points")) ml_map$2.moveLayer("points", "label_village");
    old_route_subscription.unsubscribe();
  }
});

// Settings
section$2.add_slider("Collapsed map opacity", "map_opacity", value => {
  mapContainerEl.style.opacity = value;
}, [0, 1, 0.05]);
section$2.add_slider("Collapsed map background opacity", "background_opacity", value => {
  if (!vmap.data.isExpanded) setLayerOpacity(value);
}, [0, 1, 0.05]);
section$2.add_slider("Expanded map opacity", "map_opacity_expanded", value => {
  mapContainerEl.style.setProperty('--map-opacity-expanded', value);
}, [0, 1, 0.05]);
section$2.add_slider("Expanded map background opacity", "background_opacity_expanded", value => {
  if (vmap.data.isExpanded) setLayerOpacity(value);
}, [0, 1, 0.05]);
section$2.add_slider("Route opacity", "route_opacity", value => {
  ml_map$2.setPaintProperty("route", "line-opacity", parseFloat(value));
  ml_map$2.setPaintProperty("old-route-layer", "line-opacity", parseFloat(value));
}, [0, 1, 0.05]);

const ml_map$1 = vmap.data.map;

// Add layers once the map is ready
ml_map$1.once("load", () => {
  if (ml_map$1.getSource('sv')) {
    section$1.add_comment(`<span style='color: #ff3434'>You have another SV coverage extension installed,
            so this functionality may not fully work!</span>`);
  } else {
    ml_map$1.addSource('sv', {
      type: 'raster',
      tiles: ['https://mts.googleapis.com/vt?pb=%211m4%211m3%211i{z}%212i{x}%213i{y}%212m8%211e2%212ssvv%214m2%211scc%212s*211m3*211e2*212b1*213e2*212b1*214b1%214m2%211ssvl%212s*212b1%213m11%212sen%213sUS%2112m4%211e68%212m2%211sset%212sRoadmap%2112m3%211e37%212m1%211ssmartmaps%215m1%215f2'],
      tileSize: 256
    });
    ml_map$1.addSource('ugc_sv', {
      type: 'raster',
      tiles: ['https://mts.googleapis.com/vt?pb=%211m4%211m3%211i{z}%212i{x}%213i{y}%212m8%211e2%212ssvv%214m2%211scc%212s%2A211m3%2A211e3%2A212b1%2A213e2%2A211m3%2A211e10%2A212b1%2A213e2%2A212b1%2A214b1%214m2%211ssvl%212s%2A212b1%213m16%212sen%213sUS%2112m4%211e68%212m2%211sset%212sRoadmap%2112m3%211e37%212m1%211ssmartmaps%2112m4%211e26%212m2%211sstyles%212ss.e%7Cp.c%3A%23ff0000%2Cs.e%3Ag.f%7Cp.c%3A%23bd5f1b%2Cs.e%3Ag.s%7Cp.c%3A%23f7ca9e%2C%215m1%215f2%0A'],
      tileSize: 256
    });
    ml_map$1.addLayer({
      id: 'sv-tiles',
      type: 'raster',
      source: 'sv',
      minzoom: 0,
      maxzoom: 22,
      layout: {
        visibility: settings.coverage ? "visible" : "none"
      },
      paint: {
        "raster-opacity": parseFloat(settings.coverage_opacity)
      }
    }, "route");
    ml_map$1.addLayer({
      id: 'svugc-tiles',
      type: 'raster',
      source: 'ugc_sv',
      minzoom: 0,
      maxzoom: 22,
      layout: {
        visibility: settings.coverage ? "visible" : "none"
      },
      paint: {
        "raster-opacity": parseFloat(settings.coverage_opacity)
      }
    }, "route");
  }

  // Move the layers below some others that I would like on top
  ml_map$1.moveLayer("route", "boundary_3");
  ml_map$1.moveLayer("svugc-tiles", ml_map$1.getLayer("old-route-layer") ? "old-route-layer" : "route");
  ml_map$1.moveLayer("sv-tiles", "svugc-tiles");
});

// Settings
const section$1 = panel.add_section("SV coverage", `Include official and unofficial SV coverage
    on the map. Official lines are shown in blue, unofficial lines are shown in orange.
    You may see a brown-ish colour where the two overlap. Photospheres are shown as red circles.`);
section$1.add_checkbox("Show coverage", "coverage", value => {
  ["svugc-tiles", "sv-tiles"].forEach(kind => {
    ml_map$1.setLayoutProperty(kind, "visibility", value ? "visible" : "none");
  });
});
section$1.add_slider("Coverage opacity", "coverage_opacity", value => {
  ["svugc-tiles", "sv-tiles"].forEach(kind => {
    ml_map$1.setPaintProperty(kind, "raster-opacity", parseFloat(value));
  });
}, [0, 1, 0.05]);

var _tmpl$ = /*#__PURE__*/web.template(`<div><span>Import KML file:</span><hr><div><input type=file accept=.kml class=mmt-kml-file-selector>`),
  _tmpl$2 = /*#__PURE__*/web.template(`<span>`),
  _tmpl$3 = /*#__PURE__*/web.template(`<button>Update`),
  _tmpl$4 = /*#__PURE__*/web.template(`<div><div><input type=checkbox></div><span>&nbsp;</span><div><button>Remove`),
  _tmpl$5 = /*#__PURE__*/web.template(`<div>KML layers: <span>`);
// Hashing function from https://stackoverflow.com/a/7616484
const generateHash = string => {
  let hash = 0;
  for (const char of string) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0; // Constrain to 32bit integer
  }
  return hash;
};

// Store and retrieve this separately from the settings object,
// as otherwise all actions involving saving the settings object
// become quite slow
let _stored_kml = GM_getValue("kml");
if (!_stored_kml) {
  _stored_kml = {};
  GM.setValues({
    kml: _stored_kml
  });
}
const stored_kml = _stored_kml;
async function loadKMLtext(text, storage_id, source_url) {
  try {
    var _stored_kml$storage_i, _dom$querySelector;
    setKMLstatus("parsing KML file...");
    // Generate hash and check with the one already stored
    const hash = generateHash(text);
    if (storage_id && ((_stored_kml$storage_i = stored_kml[storage_id]) == null ? void 0 : _stored_kml$storage_i.hash) === hash) {
      setKMLstatus("no update found");
      stored_kml[storage_id].lastChecked = Date.now();
      GM.setValues({
        kml: stored_kml
      });
      setSolidKeys();
      return;
    }
    ;

    // Check if this is a "keep up to date" KML
    const dom = new DOMParser().parseFromString(text, "text/xml");
    if (dom.querySelector('parsererror')) {
      throw new Error("XML parse error");
    }
    const hrefNode = dom.querySelector("Document > NetworkLink > Link > href");
    if (hrefNode) {
      loadKMLurl(hrefNode.childNodes[0].nodeValue, storage_id);
      return;
    }
    let name = (_dom$querySelector = dom.querySelector("Document > name")) == null ? void 0 : _dom$querySelector.innerHTML;
    const features = togeojson.kml(dom).features;

    // Support for random opacity for areas
    features.forEach(feature => {
      feature.properties.random = Math.random();
    });

    // Store the features in extension storage
    if (!storage_id) {
      if (!name) {
        name = marker_panel.container.getElementsByClassName("mmt-kml-file-selector")[0].files[0].name;
      }
      storage_id = crypto.randomUUID();
      stored_kml[storage_id] = {
        name,
        enabled: true,
        features: features
      };
      setKMLstatus(`${stored_kml[storage_id].name} loaded`);
    } else {
      if (name) stored_kml[storage_id].name = name;
      stored_kml[storage_id].features = features;
      setKMLstatus(`${stored_kml[storage_id].name} updated`);
    }
    stored_kml[storage_id].lastUpdated = Date.now();
    stored_kml[storage_id].hash = hash;
    if (source_url) {
      stored_kml[storage_id].url = source_url;
      stored_kml[storage_id].lastChecked = Date.now();
    }
    ;
    GM.setValues({
      kml: stored_kml
    });
    setSolidKeys();
  } catch (error) {
    setKMLstatus(error);
    console.error(error);
  }
}
async function loadKMLurl(url, storage_id) {
  setKMLstatus("downloading KML file...");

  // Handle Google My Maps links
  if (url.includes("https://www.google.com/maps/d/edit") || url.includes("https://www.google.com/maps/d/viewer") || url.match("https://www.google.com/maps/d/u/[0-9]/edit") || url.match("https://www.google.com/maps/d/u/[0-9]/viewer")) {
    const urlObject = new URL(url);
    const mid = urlObject.searchParams.get("mid");
    url = `https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=${mid}`;
  }
  GM.xmlHttpRequest({
    method: "GET",
    url: url,
    onload: async response => {
      if (response.status !== 200) {
        setKMLstatus("Error retrieving URL");
        return;
      }
      const result = response.responseText;
      loadKMLtext(result, storage_id, url);
    }
  });
}
const ml_map = vmap.data.map;
const maplibre = await( IRF__namespace.modules.maplibre);

// Add the source and layers to the map
ml_map.once("load", () => {
  ml_map.addSource('kml_points', {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection',
      'features': []
    }
  });
  ml_map.addLayer({
    id: 'kml-points',
    type: 'circle',
    source: 'kml_points',
    paint: {
      'circle-radius': 5,
      'circle-color': ['get', 'icon-color'],
      'circle-stroke-color': "#fff",
      'circle-stroke-width': 2,
      'circle-opacity': parseFloat(settings.kml_points_opacity),
      'circle-stroke-opacity': parseFloat(settings.kml_points_opacity)
    },
    filter: ['in', '$type', 'Point']
  });
  ml_map.addLayer({
    id: 'kml-lines-outline',
    type: 'line',
    source: 'kml_points',
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    paint: {
      'line-color': "#fff",
      'line-width': 2,
      'line-gap-width': 3,
      'line-opacity': .5
    },
    filter: ['in', '$type', 'LineString']
  });
  ml_map.addLayer({
    id: 'kml-lines',
    type: 'line',
    source: 'kml_points',
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    paint: {
      'line-color': ['get', 'stroke'],
      'line-width': 5,
      'line-dasharray': settings.kml_lines_dashed ? [3, 2] : [1],
      'line-opacity': parseFloat(settings.kml_lines_opacity)
    },
    filter: ['in', '$type', 'LineString']
  });
  ml_map.addLayer({
    id: 'kml-shapes',
    type: 'fill',
    source: 'kml_points',
    paint: {
      'fill-color': ['let', 'colour', ['to-rgba', ['get', 'fill']], ['rgba', ['at', 0, ['var', 'colour']], ['at', 1, ['var', 'colour']], ['at', 2, ['var', 'colour']], ['*', parseFloat(settings.klm_shapes_opacity), ['-', 1, ['*', 0.4, ['get', 'random']]]]]],
      'fill-outline-color': ['let', 'colour', ['to-rgba', ['get', 'stroke']], ['rgba', ['at', 0, ['var', 'colour']], ['at', 1, ['var', 'colour']], ['at', 2, ['var', 'colour']], parseFloat(settings.klm_shapes_outline_opacity)]]
    },
    filter: ['in', '$type', 'Polygon']
  });
  ml_map.moveLayer("kml-points", "label_other");
  ml_map.moveLayer("kml-lines", ml_map.getLayer("old-route-layer") ? "old-route-layer" : "route");
  ml_map.moveLayer("kml-lines-outline", "kml-lines");
  ml_map.moveLayer("kml-shapes", ml_map.getLayer("sv-tiles") ? "sv-tiles" : ml_map.getLayer("old-route-layer") ? "old-route-layer" : "route");

  // Update the map when the loaded KML files change
  solidJs.createEffect(() => {
    const collection = {
      'type': 'FeatureCollection',
      'features': []
    };
    for (const [index] of KMLkeys()) {
      if (stored_kml[index].enabled) {
        collection.features.push(...stored_kml[index].features);
      }
    }
    ml_map.getSource('kml_points').setData(collection);
  });

  // Popup code adapted from https://maplibre.org/maplibre-gl-js/docs/examples/display-a-popup-on-hover/
  const popup = new maplibre.Popup({
    closeButton: false,
    closeOnClick: false
  });
  let currentFeatureCoordinates = undefined;
  ml_map.on('mousemove', 'kml-points', e => {
    if (e.features[0].geometry.type === 'Point') {
      const featureCoordinates = e.features[0].geometry.coordinates.toString();
      if (currentFeatureCoordinates !== featureCoordinates) {
        currentFeatureCoordinates = featureCoordinates;
        const coordinates = e.features[0].geometry.coordinates;
        const description = e.features[0].properties.name;
        if (description.length > 0) popup.setLngLat([coordinates[0], coordinates[1]]).setHTML(description).addTo(ml_map);
      }
    }
  });
  ml_map.on('mouseleave', 'kml-points', () => {
    currentFeatureCoordinates = undefined;
    if (popup.isOpen()) popup.remove();
  });

  // Check for updates to the KML files
  if (settings.kml_update_check) {
    const now = Date.now();
    Object.keys(stored_kml).forEach(key => {
      var _stored_kml$key, _stored_kml$key2, _stored_kml$key3;
      if (stored_kml[key].enabled && (_stored_kml$key = stored_kml[key]) != null && _stored_kml$key.url && (!((_stored_kml$key2 = stored_kml[key]) != null && _stored_kml$key2.lastChecked) || now - ((_stored_kml$key3 = stored_kml[key]) == null ? void 0 : _stored_kml$key3.lastChecked) > 43200000)) loadKMLurl(stored_kml[key].url, key);
    });
  }
});

// Settings
const section = marker_panel.add_section("KML layers", `For more complex maps,
    you can use <a href="https://mymaps.google.com/" target="_blank">Google My Maps</a>
    or another map creation tool to create KML files with many markers. You can then
    add your KML files here to show them on the in-game map!<br><br>
    Make sure you download as KML and not KMZ, and do select "keep data up to date" if
    you would like the option to automatically update the layer when the source map changes.<br><br>
    You can also add a map using a link to a KML file or to a Google My Maps map.`);
const import_item = (() => {
  var _el$ = _tmpl$(),
    _el$2 = _el$.firstChild,
    _el$3 = _el$2.nextSibling,
    _el$4 = _el$3.nextSibling,
    _el$5 = _el$4.firstChild;
  _el$5.addEventListener("change", event => {
    // Adapted from https://developer.mozilla.org/en-US/docs/Web/API/FileReader#examples
    const file = event.target.files[0];
    if (!file) {
      alert("No file selected. Please choose a file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      loadKMLtext(reader.result);
    };
    reader.onerror = () => {
      alert("Error reading the file. Please try again.");
    };
    reader.readAsText(file);
  });
  web.effect(_p$ => {
    var _v$ = styles['settings-item'],
      _v$2 = styles['setting'],
      _v$3 = styles['setting'];
    _v$ !== _p$.e && web.className(_el$, _p$.e = _v$);
    _v$2 !== _p$.t && web.className(_el$2, _p$.t = _v$2);
    _v$3 !== _p$.a && web.className(_el$4, _p$.a = _v$3);
    return _p$;
  }, {
    e: undefined,
    t: undefined,
    a: undefined
  });
  return _el$;
})();
web.render(() => import_item, section.container);
section.add_button("Import KML from URL", () => {
  const url = prompt("Paste the URL of your KML file here:");
  if (url) loadKMLurl(url);
});
section.add_checkbox("Check enabled layers for updates every 12 hours", "kml_update_check");

// Solid magic to support managing multiple files
function generateSolidKeys() {
  return Object.entries(stored_kml).map(([key, value]) => {
    return [key, value.hash];
  });
}
const [KMLkeys, setKMLkeys] = solidJs.createSignal(generateSolidKeys());
function setSolidKeys() {
  setKMLkeys(generateSolidKeys());
}
function padNumber(number, pad) {
  return String(number).padStart(pad, '0');
}
function numberToDate(number) {
  if (!number) return "";
  const date = new Date(number);
  return `${date.getFullYear()}/${padNumber(date.getMonth() + 1, 2)}/${padNumber(date.getDate(), 2)} - ` + `${padNumber(date.getHours(), 2)}:${padNumber(date.getMinutes(), 2)}`;
}
const KMLRow = props => {
  return (() => {
    var _el$6 = _tmpl$4(),
      _el$7 = _el$6.firstChild,
      _el$8 = _el$7.firstChild,
      _el$9 = _el$7.nextSibling,
      _el$0 = _el$9.firstChild,
      _el$10 = _el$9.nextSibling,
      _el$12 = _el$10.firstChild;
    _el$8.addEventListener("change", e => {
      stored_kml[props.id].enabled = e.currentTarget.checked;
      setSolidKeys();
      GM.setValues({
        kml: stored_kml
      });
    });
    web.insert(_el$9, () => stored_kml[props.id].name, _el$0);
    web.insert(_el$9, web.createComponent(solidJs.Show, {
      get when() {
        return stored_kml[props.id].lastUpdated;
      },
      get children() {
        var _el$1 = _tmpl$2();
        web.effect(_p$ => {
          var _v$4 = "- " + numberToDate(stored_kml[props.id].lastUpdated),
            _v$5 = styles['sidenote'],
            _v$6 = stored_kml[props.id].lastChecked ? "Last update check: " + numberToDate(stored_kml[props.id].lastChecked) : "Last updated";
          _v$4 !== _p$.e && (_el$1.innerText = _p$.e = _v$4);
          _v$5 !== _p$.t && web.className(_el$1, _p$.t = _v$5);
          _v$6 !== _p$.a && web.setAttribute(_el$1, "title", _p$.a = _v$6);
          return _p$;
        }, {
          e: undefined,
          t: undefined,
          a: undefined
        });
        return _el$1;
      }
    }), null);
    web.insert(_el$10, web.createComponent(solidJs.Show, {
      get when() {
        return stored_kml[props.id].url;
      },
      get children() {
        return [(() => {
          var _el$11 = _tmpl$3();
          _el$11.$$click = () => {
            loadKMLurl(stored_kml[props.id].url, props.id);
          };
          return _el$11;
        })(), "\xA0"];
      }
    }), _el$12);
    _el$12.$$click = () => {
      delete stored_kml[props.id];
      setSolidKeys();
      GM.setValues({
        kml: stored_kml
      });
    };
    web.effect(_p$ => {
      var _v$7 = styles['settings-item'],
        _v$8 = styles['setting'],
        _v$9 = IRF__namespace.ui.panel.styles.toggle,
        _v$0 = styles['setting'],
        _v$1 = styles['setting'];
      _v$7 !== _p$.e && web.className(_el$6, _p$.e = _v$7);
      _v$8 !== _p$.t && web.className(_el$7, _p$.t = _v$8);
      _v$9 !== _p$.a && web.className(_el$8, _p$.a = _v$9);
      _v$0 !== _p$.o && web.className(_el$9, _p$.o = _v$0);
      _v$1 !== _p$.i && web.className(_el$10, _p$.i = _v$1);
      return _p$;
    }, {
      e: undefined,
      t: undefined,
      a: undefined,
      o: undefined,
      i: undefined
    });
    web.effect(() => _el$8.checked = stored_kml[props.id].enabled);
    return _el$6;
  })();
};
const [KMLstatus, setKMLstatus] = solidJs.createSignal("");
const list_item = [(() => {
  var _el$13 = _tmpl$5(),
    _el$14 = _el$13.firstChild,
    _el$15 = _el$14.nextSibling;
  web.effect(_p$ => {
    var _v$10 = styles['setting'],
      _v$11 = KMLstatus(),
      _v$12 = styles['sidenote'];
    _v$10 !== _p$.e && web.className(_el$13, _p$.e = _v$10);
    _v$11 !== _p$.t && (_el$15.innerText = _p$.t = _v$11);
    _v$12 !== _p$.a && web.className(_el$15, _p$.a = _v$12);
    return _p$;
  }, {
    e: undefined,
    t: undefined,
    a: undefined
  });
  return _el$13;
})(), web.createComponent(solidJs.For, {
  get each() {
    return KMLkeys();
  },
  children: item => web.createComponent(KMLRow, {
    get id() {
      return item[0];
    }
  })
})];
web.render(() => list_item, section.container);
const section_styling = marker_panel.add_section("KML layer appearance", `Adjust the opacities
    of the various KML objects. The lines are dashed by default to distinguish them from
    everything else on the map, and the areas appear with slightly varying opacities to
    distinguish them when close together.`);
section_styling.add_checkbox("KML lines dashed", "kml_lines_dashed", value => {
  ml_map.setPaintProperty("kml-lines", 'line-dasharray', value ? [3, 2] : [1]);
});
section_styling.add_slider("KML marker opacity", "kml_points_opacity", value => {
  ml_map.setPaintProperty("kml-points", "circle-opacity", parseFloat(value));
  ml_map.setPaintProperty("kml-points", 'circle-stroke-opacity', parseFloat(value));
}, [0, 1, 0.05]);
section_styling.add_slider("KML lines opacity", "kml_lines_opacity", value => {
  ml_map.setPaintProperty("kml-lines", "line-opacity", parseFloat(value));
}, [0, 1, 0.05]);
section_styling.add_slider("KML shape opacity", "klm_shapes_opacity", value => {
  ml_map.setPaintProperty("kml-shapes", "fill-color", ['let', 'colour', ['to-rgba', ['get', 'fill']], ['rgba', ['at', 0, ['var', 'colour']], ['at', 1, ['var', 'colour']], ['at', 2, ['var', 'colour']], ['*', parseFloat(value), ['-', 1, ['*', 0.4, ['get', 'random']]]]]]);
}, [0, 1, 0.05]);
section_styling.add_slider("KML shape outline opacity", "klm_shapes_outline_opacity", value => {
  ml_map.setPaintProperty("kml-shapes", 'fill-outline-color', ['let', 'colour', ['to-rgba', ['get', 'stroke']], ['rgba', ['at', 0, ['var', 'colour']], ['at', 1, ['var', 'colour']], ['at', 2, ['var', 'colour']], parseFloat(value)]]);
}, [0, 1, 0.05]);
web.delegateEvents(["click"]);

error_section.add_comment("(the awaits have resolved correctly)");
GM.addStyle(css_248z);

// Export some APIs

unsafeWindow._MMT_control = control;
unsafeWindow._MMT_addContext = addContext;
unsafeWindow._MMT_getMarkers = () => {
  return markers;
};
error_section.container.remove();

})(VM.solid.web, IRF, VM.solid, geoCoordinatesParser, turf, toGeoJSON);
