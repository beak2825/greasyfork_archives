// ==UserScript==
// @name        BetterTeddit Extension - User IDs
// @namespace   betterteddit_userids
// @match       https://*.teddit.net/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addValueChangeListener
// @grant       GM_addStyle
// @run-at      document-start
// @version     1.0
// @author      Hououin Kyōma
// @license     GPLv3
// @description Requires BetterTeddit. Add IDs and optionally colorized IDs.
// @downloadURL https://update.greasyfork.org/scripts/452561/BetterTeddit%20Extension%20-%20User%20IDs.user.js
// @updateURL https://update.greasyfork.org/scripts/452561/BetterTeddit%20Extension%20-%20User%20IDs.meta.js
// ==/UserScript==

const config = {
  user_ids: {
    name: "User IDs",
    desc: "Adds a hashed ID after usernames.",
    default: true
  },
  colorized_ids: {
    name: "Colorized IDs",
    desc: "Gives IDs a color based on their ID.",
    default: true
  }
}

function log(message) {
  if (typeof message == "string") {
    console.log("BetterTeddit Extension - User IDs: " + message);
  } else {
    console.log(message);
  }
}

function init_values() {
  function check_value(key, value) {
    if (GM_getValue(key) == undefined) {
      GM_setValue(key, value);
      log("Undefined, Setting default: [" + key + "]");
      log(value);
    } else {
      log("Value found, Getting value: [" + key + "]");
      log(GM_getValue(key));
    }
  }
  Object.entries(config).forEach( (key, value) => {
    check_value(key[0], key[1]["default"]);
  });
}

function create_toggle(config_name) {
  var toggle = config[config_name];
  var li = document.createElement("li");
  li.id = "pref_li_"+config_name+""
  var label = document.createElement("label");
  label.id = "pref_label_"+config_name+"";
  label.setAttribute("for", "pref_check_"+config_name+"");
  label.innerHTML = "<a>"+toggle["name"]+"</a>";
  var checkbox = document.createElement("input");
  checkbox.id = "pref_check_"+config_name+"";
  checkbox.type = "checkbox";

  if (GM_getValue(config_name) == true) {
    checkbox.checked = true;
  }
  GM_addValueChangeListener(""+config_name+"", function(key, old_val, new_val, remote) {
    if (arguments[2] == true) {
      checkbox.checked = true;
    } else {
      checkbox.checked = false;
    }
    log("Set GM Value "+config_name+" to "+arguments[2]+".");
  });
  checkbox.addEventListener("change", (event) => {
    if (checkbox.checked == true) {
      GM_setValue(""+config_name+"", true);
    } else {
      GM_setValue(""+config_name+"", false);
    }
    log("Set "+config_name+" config checkbox to "+checkbox.checked+".");
  });

  var desc = document.createElement("span");
  desc.id = "pref_desc_"+config_name+"";
  desc.innerHTML = ""+toggle["desc"]+"";
  li.appendChild(checkbox);
  li.appendChild(label);
  li.appendChild(desc);
  return li;
}

function user_ids() {
  if (GM_getValue("user_ids") != true) {
    return false;
  }
  var style = `
  .id_container {
    margin-left: 0.5em;
    font-weight: normal;
    color: inherit;
    overflow: auto;
  }

  .entry span.id_container {
    margin-right: 4px;
  }
  span.id_tag {
    margin-left: 0!important;
  }
  .id_tag.colorized_id {
    padding: 2px;
    color: #000;
    border-radius: 1px;
  }

  `;
  GM_addStyle(style);

  function generate_id(name) {
    const cyrb53 = (str, seed = 0) => {
      // https://stackoverflow.com/a/52171480
      let h1 = 0xdeadbeef ^ seed,
        h2 = 0x41c6ce57 ^ seed;
      for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
      }
      h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
      h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
      return 4294967296 * (2097151 & h2) + (h1 >>> 0);
    };
    return cyrb53(name).toString(36).padStart(8,0).substr(0, 8);
  }

  var users = document.querySelectorAll("a[user]");
  [...users].forEach( (user) => {
    var name = user.getAttribute("user");
    var user_id = generate_id(name)
    user.setAttribute("user_id", user_id );
    var id_container = document.createElement("span");
    id_container.classList.add("id_container");
    id_container.textContent = "ID: ";
    user.insertAdjacentElement("afterend", id_container);
    var id_tag = document.createElement("span");
    id_tag.classList.add("id_tag");
    id_tag.setAttribute("user_id", user_id);
    id_tag.textContent = user_id;
    id_container.appendChild(id_tag);

    if (GM_getValue("colorized_ids") == true) {
      function stringToHslColor(str, s, l) {
        // https://scribe.bus-hit.me/@pppped/compute-an-arbitrary-color-for-user-avatar-starting-from-his-username-with-javascript-cd0675943b66
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        var h = hash % 360;
        return 'hsl('+h+', '+s+'%, '+l+'%)';
      }
      id_tag.classList.add("colorized_id");
      id_tag.style.backgroundColor = stringToHslColor(user_id, 50, 50);
    }
  });

}

window.addEventListener("during_document_loaded", () => {
  init_values();
});

window.addEventListener("after_user_tag", () => {
  // This extension relies on waiting for a[user] attributes to be done first
  // so it doesn't need to redo anything and remains compatible with forced anon.
  // but you can find another event to attach to. If nothing else, after_document_loaded.
  user_ids();
});

window.addEventListener("after_open_preferences", () => {
  var general_tab = document.getElementById("pref_general_content");

  var fieldset = document.createElement("fieldset");
  fieldset.id = "pref_user_ids_fieldset";
  var legend = document.createElement("legend");
  legend.textContent = "Extension: User IDs";
  fieldset.appendChild(legend);
  var ul = document.createElement("ul");
  fieldset.appendChild(ul);

  ul.appendChild( create_toggle("user_ids") );
  ul.appendChild( create_toggle("colorized_ids") );

  general_tab.appendChild(fieldset);

});