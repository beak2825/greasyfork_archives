// ==UserScript==
// @name     GOG.com - Sale Helper
// @version  2
// @namespace ssokolow.com
// @description A simple helper to make GOG.com's grid-view catalogue listings more scannable during a sale
//
// @compatible firefox Tested under Greasemonkey 4 and ViolentMonkey
// @compatible chrome Tested under TamperMonkey
//
// @include  https://www.gog.com/games?*
//
// @require  https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require  https://openuserjs.org/src/libs/sizzle/GM_config.js
//
// @grant    GM_registerMenuCommand
// @grant    GM.registerMenuCommand
//
// @grant    GM_getValue
// @grant    GM_setValue
// NOTE: GM_config doesn't currently support GM4 APIs, so allowing the GM4
//       versions of these isn't helpful and could result in users losing
//       access to their settings if GM_config suddenly starts supporting
//       them without transparently migrating data from its localStorage
//       fallback.
// @downloadURL https://update.greasyfork.org/scripts/375524/GOGcom%20-%20Sale%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/375524/GOGcom%20-%20Sale%20Helper.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

var fieldDefs = {
  'discount_min': {
    'section': 'Minimum Discount Percentage',
    'label': 'Minimum',
    'labelPos': 'left',
    'type': 'number',
    'min': 0,
    'max': 99,
    'default': 50,
    'tail': '%',
  },
  'discount_preferred': {
    'label': 'Preferred',
    'type': 'number',
    'min': 0,
    'max': 99,
    'default': 75,
    'tail': '%',
  },
  'discount_preferred_fgcolor': {
    'label': 'Foreground',
    'type': 'color',
    'default': '#ffffff',
  },
  'discount_preferred_bgcolor': {
    'label': 'Background',
    'type': 'color',
    'default': '#00aa00',
  },
  'discount_rare': {
    'label': 'Rare Bargain',
    'type': 'number',
    'min': 0,
    'max': 99,
    'default': 76,
    'tail': '%',
  },
  'discount_rare_fgcolor': {
    'label': 'Foreground',
    'type': 'color',
    'default': '#ffffff',
  },
  'discount_rare_bgcolor': {
    'label': 'Background',
    'type': 'color',
    'default': '#ff0000',
  },
  'price_max': {
    'section': 'Maximum Price',
    'label': 'Maximum',
    'labelPos': 'left',
    'type': 'number',
    'min': '0',
    'step': '0.01',
    'default': '15.00',
  },
  'price_low': {
    'label': 'Preferred',
    'type': 'number',
    'min': '0',
    'step': '0.01',
    'default': '5.00',
  },
  'price_low_fgcolor': {
    'label': 'Foreground',
    'type': 'color',
    'default': '#ffffff',
  },
  'price_low_bgcolor': {
    'label': 'Background',
    'type': 'color',
    'default': '#00aa00',
  },
  'price_impulse': {
    'label': 'Impulse Buys',
    'type': 'number',
    'min': '0',
    'step': '0.01',
    'default': '2.00',
  },
  'price_impulse_fgcolor': {
    'label': 'Foreground',
    'type': 'color',
    'default': '#ffffff',
  },
  'price_impulse_bgcolor': {
    'label': 'Background',
    'type': 'color',
    'default': '#ff0000',
  },
  'hide_owned': {
    'section': 'Other Filters',
    'label': 'Hide entries marked "In Library"',
    'labelPos': 'left',
    'type': 'checkbox',
    'default': true,
  },
  'hide_title_regex': {

    'label': 'Hide entries with titles matching:',
    'labelPos': 'left',
    'type': 'text',
    'size': 35,
    'default': "(Upgrade|[ ]OST|Soundtrack|Artbook)$",
  },
};

function remove_tile(mutation_event) {
  mutation_event.target.closest(".product-tile").remove();
}

let observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mut) {
    if (mut.type == "attributes" && mut.attributeName == "class" &&
        mut.target.classList.contains("product-tile__labels--in-library")) {
      // Hide entries that are already owned
    	remove_tile(mut);

    } else if (mut.type == "childList" && mut.target.classList.contains("product-tile__discount")) {
      // Hide entries that are below the minimum discount
      // and highlight ones with abnormally high discounts
      let discount = mut.target.innerText;
      let discount_parsed = Number.parseInt(discount.substring(1, discount.length - 1));
      if (discount_parsed < GM_config.get('discount_min')) {
        remove_tile(mut);
      } else if (discount_parsed >= GM_config.get('discount_rare')) {
        mut.target.style.color = GM_config.get('discount_rare_fgcolor');
        mut.target.style.backgroundColor = GM_config.get('discount_rare_bgcolor');
      } else if (discount_parsed >= GM_config.get('discount_preferred')) {
        mut.target.style.color = GM_config.get('discount_preferred_fgcolor');
        mut.target.style.backgroundColor = GM_config.get('discount_preferred_bgcolor');
      }
    } else if (mut.type == "childList" && mut.target.classList.contains("product-tile__prices")) {
      // Hide entries that are over the maximum price
      // and highlight ones at or below the preferred price
      let discounted = mut.target.querySelector(".product-tile__price-discounted");
      let price = Number.parseFloat(discounted.innerText);

      if (price > GM_config.get('price_max')) {
        remove_tile(mut);
      } else if (price <= GM_config.get('price_impulse')) {
        discounted.style.color = GM_config.get('price_impulse_fgcolor');
        discounted.style.backgroundColor = GM_config.get('price_impulse_bgcolor');
      } else if (price <= GM_config.get('price_low')) {
        discounted.style.color = GM_config.get('price_low_fgcolor');
        discounted.style.backgroundColor = GM_config.get('price_low_bgcolor');
      }

      discounted.style.padding = '2px';
      discounted.style.borderRadius = '2px';

    } else if (mut.type == "childList" && mut.target.classList.contains("product-tile__title")) {
      let regex_str = GM_config.get('hide_title_regex');
      if (regex_str && regex_str.trim() && RegExp(regex_str).test(mut.target.innerText)) {
        remove_tile(mut);
      }
    }

  });
});

let frame = document.createElement('div');
document.body.append(frame);

GM_config.init({
  id: 'sale_filter_GM_config',
  title: "Sale Helper Settings",
  fields: fieldDefs,
  css: ('#sale_filter_GM_config ' + [
    	// Match GOG.com styling more closely
    	"{ box-shadow: 0 0 15px rgba(0,0,0,.15),0 1px 3px rgba(0,0,0,.15); " +
       " background: #ccc; color: #212121; border: 0 !important; " +
       " height: auto !important; width: auto !important; margin: auto; padding: 1ex !important; }",
      " * { font-family: Lato GOG,Lato GOG Latin,sans-serif; }",
      ".config_header, .section_header { font-weight: 700; margin: 1ex 0 -1ex; }",
    	".section_header { color: #212121; background-color: inherit; border-width: 0 0 1px 0; " +
       " font-size: 16px; border-bottom: 1px solid #bfbfbf; " +
       " margin: 1em 1em 1ex 1em; text-align: left !important; " +
    	 " clear: both; }",
    	" .title_underline { display: inline-block; border-bottom: 1px solid #212121; padding: 5px 0; }",
    	".field_label { display: inline-block; min-width: 9em; text-align: right; }",
      ".field_label, .field_tail { font-size: 12px; }",
    	".field_tail { margin-left: 0.5ex; font-weight: 700; }",
    	".config_var { float: left; margin-right: 1ex; }",
    	".reset { margin-right: 12px; }",
    	"button, input, .field_tail { vertical-align: middle; }",
    	"input[type='checkbox'] { margin: 0 0.5ex 0 2.5ex; }",
    	"input[type='number'] { width: 5em; }",
    	"input[type='color'] { box-sizing: content-box; height: 1.1em; width: 2em; }",
    	"#sale_filter_GM_config_field_discount_min, #sale_filter_GM_config_field_discount_preferred, " +
       " #sale_filter_GM_config_field_discount_rare { width: 4em !important; }",
    	"#sale_filter_GM_config_buttons_holder { padding-top: 1ex; }",
    	"#sale_filter_GM_config_hide_title_regex_var, #sale_filter_GM_config_hide_owned_var " +
       " { margin-left: 3ex !important; }",
    	"#sale_filter_GM_config_field_hide_owned { margin-left: 1ex; }",
    	"#sale_filter_GM_config_discount_min_var, #sale_filter_GM_config_discount_preferred_var, " +
       " #sale_filter_GM_config_discount_rare_var, #sale_filter_GM_config_price_impulse_var, " +
       " #sale_filter_GM_config_price_low_var, #sale_filter_GM_config_price_max_var, " +
       " #sale_filter_GM_config_hide_title_regex_var, #sale_filter_GM_config_buttons_holder " +
       " { clear: left; }",
    ].join('\n#sale_filter_GM_config ')),
  events: {
    open: function(doc) {
      this.frame.querySelectorAll('.section_header').forEach(function(node) {
        let inner = document.createElement('div');
        inner.classList.add("title_underline");

        inner.innerText = node.innerText;
        node.firstChild.replaceWith(inner);
      });
    },
  },
  types: {
    'color': {
      default: '#ffffff',
      toNode: function(configId) {
        var field = this.settings,
            id = this.id,
            value = this.value,
            create = this.create,
            retNode = create('div', { className: 'config_var',
              id: configId + '_' + id + '_var',
              title: field.title || '' });

        // Create the field lable
        retNode.appendChild(create('label', {
          innerHTML: field.label,
          id: configId + '_' + id + '_field_label',
          for: configId + '_field_' + id,
          className: 'field_label'
        }));

        // Actually create and append the input element
        retNode.appendChild(create('input', {
            id: configId + '_field_' + id,
            type: 'color',
            value: value ? value : this['default'],
        }));

        return retNode;
      },
      toValue: function() {
        if (this.wrapper) {
          return this.wrapper.getElementsByTagName('input')[0].value;
        }
      },
      reset: function() {
        if (this.wrapper) {
          this.wrapper.getElementsByTagName('input')[0].value = this['default'];
        }
      }
    },
    'number': {
      default: '0',
      toNode: function() {
        console.log(this);
        var field = this.settings,
            id = this.id,
            value = this.value,
            create = this.create,
            configId = this.configId,
            retNode = create('div', { className: 'config_var',
              id: configId + '_' + id + '_var',
              title: field.title || '' });

        // Create the field label
        retNode.appendChild(create('label', {
          innerHTML: field.label,
          id: configId + '_' + id + '_field_label',
          for: configId + '_field_' + id,
          className: 'field_label'
        }));

        let params = {
            id: configId + '_field_' + id,
            type: 'number',
            value: value ? value : this['default'],
        };
        if (field.min || field.min === 0) { params.min = field.min; }
        if (field.max || field.max === 0) { params.max = field.max; }
        if (field.step) { params.step = field.step; }

        // Actually create and append the input element
        retNode.appendChild(create('input', params));

        if (field.tail) {
          retNode.appendChild(create('span', {
            innerHTML: field.tail ,
            className: 'field_tail',
          }));
        }
        
        return retNode;
      },
      toValue: function() {
        if (this.wrapper) {
          let val = Number(this.wrapper.getElementsByTagName('input')[0].value);
          if (isNaN(val)) { return null; }
          return val;
        }
      },
      reset: function() {
        if (this.wrapper) {
          this.wrapper.getElementsByTagName('input')[0].value = this['default'];
        }
      }
    }
  },
  frame: frame,
});
GM.registerMenuCommand("Configure Sale Helper...",
                       function() { GM_config.open(); }, 'C');


let catalog = document.querySelector(".catalog__wrapper");
observer.observe(catalog, { attributes: GM_config.get('hide_owned'), childList: true, subtree: true });