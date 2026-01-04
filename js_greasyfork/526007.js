// ==UserScript==
// @name               Libib - Custom status indicator style
// @name:it            Libib - Stile indicatore stato personalizzato
// @description        Set a custom color and style for libib.com item status indicator and more
// @description:it     Modifica i colori e lo stile dell'indicatore dello stato di un oggetto di libib.com
// @author             JetpackCat
// @namespace          https://github.com/JetpackCat-IT/libib-custom-status-style
// @supportURL         https://github.com/JetpackCat-IT/libib-custom-status-style/issues
// @icon               https://github.com/JetpackCat-IT/libib-custom-status-style/raw/v1.0.0/img/icon_64.png
// @version            2.0.0
// @license            GPL-3.0-or-later; https://raw.githubusercontent.com/JetpackCat-IT/libib-custom-status-style/master/LICENSE
// @match              https://www.libib.com/library
// @icon               https://www.libib.com/img/favicon.png
// @run-at             document-idle
// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM.getValue
// @grant              GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/526007/Libib%20-%20Custom%20status%20indicator%20style.user.js
// @updateURL https://update.greasyfork.org/scripts/526007/Libib%20-%20Custom%20status%20indicator%20style.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Get libib sidebar menu. The settings button will be added to the sidebar
  const libib_sidebar_menu = document.getElementById("primary-menu");

  // Create the element, it needs to be an <a> tag inside an <li> tag
  const settings_button_a = document.createElement("a");
  settings_button_a.appendChild(
      document.createTextNode("Libib status settings")
  );

  // Create <li> element and insert <a> element inside
  const settings_button_li = document.createElement("li");
  settings_button_li.appendChild(settings_button_a);

  // Assign click event handler to open the menu settings
  settings_button_li.addEventListener("click", function () {
      gmc.open();
  });

  // Add <li> element to the sidebar
  libib_sidebar_menu.appendChild(settings_button_li);

  // Create a container for the configuration elements
  const config_container = document.createElement("div");
  document.body.appendChild(config_container);

  const copyToClipboard = (text) => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
          document.execCommand('copy');
      } catch (err) {
          console.error('Failed to copy text: ', err);
      }
      document.body.removeChild(textarea);
  }

  const readFromClipboard = async () => {
      return await navigator.clipboard.readText();
  }

  // For cover blur
  let blur_groups = [];

  // Adapt container background color and shadow based on libib theme (dark/light)
  const is_dark_scheme = document.body.classList.contains("dark");
  let background_color = "#fefefe";
  let shadow_color = "#838383";

  if (is_dark_scheme) {
      background_color = "#1b1b1b";
      shadow_color = "#e7e7e7";
  }
  const config_panel_css = `#libib_status_config{padding: 20px !important; background-color: ${background_color}; box-shadow: 0px 0px 9px 3px ${shadow_color}}; `;

  let gmc = new GM_config({
      id: "libib_status_config", // The id used for this instance of GM_config
      title: "Script Settings", // Panel Title
      types: {
          // Create color input type
          color: {
              default: null,
              toNode: function () {
                  var field = this.settings,
                      value = this.value,
                      id = this.id,
                      create = this.create,
                      slash = null,
                      retNode = create("div", {
                          className: "config_var",
                          id: this.configId + "_" + id + "_var",
                          title: field.title || "",
                      });

                  // Create the field lable
                  retNode.appendChild(
                      create("label", {
                          innerHTML: field.label,
                          id: this.configId + "_" + id + "_field_label",
                          for: this.configId + "_field_" + id,
                          className: "field_label",
                      })
                  );
                  // Create the actual input element
                  var props = {
                      id: this.configId + "_field_" + id,
                      type: "color",
                      value: value ?? "",
                  };
                  // Actually create and append the input element
                  retNode.appendChild(create("input", props));
                  return retNode;
              },
              toValue: function () {
                  let input = document.getElementById(
                      `${this.configId}_field_${this.id}`
                  );
                  if(input != null) return input.value;
              },
              reset: function () {
                  let input = document.getElementById(
                      `${this.configId}_field_${this.id}`
                  );
                  input.value = this.default;
              },
          },
          number: {
              default: null,
              toNode: function () {
                  var field = this.settings,
                      value = this.value,
                      id = this.id,
                      create = this.create,
                      slash = null,
                      retNode = create("div", {
                          className: "config_var",
                          id: this.configId + "_" + id + "_var",
                          title: field.title || "",
                      });

                  // Create the field lable
                  retNode.appendChild(
                      create("label", {
                          innerHTML: field.label,
                          id: this.configId + "_" + id + "_field_label",
                          for: this.configId + "_field_" + id,
                          className: "field_label",
                      })
                  );
                  // Create the actual input element
                  var props = {
                      id: this.configId + "_field_" + id,
                      type: "number",
                      value: value ?? "",
                  };
                  // Actually create and append the input element
                  retNode.appendChild(create("input", props));
                  return retNode;
              },
              toValue: function () {
                  let input = document.getElementById(
                      `${this.configId}_field_${this.id}`
                  );
                  if(input != null) return input.value;
              },
              reset: function () {
                  let input = document.getElementById(
                      `${this.configId}_field_${this.id}`
                  );
                  input.value = this.default;
              },
          },
      },
      // Fields object
      fields: {
          // This is the id of the field
          type: {
              label: "Indicator type", // Appears next to field
              type: "radio", // Makes this setting a radio field
              options: ["Triangle", "Border"], // Default = triangle
              default: "Triangle", // Default value if user doesn't change it
          },
          // This is the id of the field
          trianglePosition: {
              label: "Triangle position", // Appears next to field
              type: "select", // Makes this setting a select field
              options: ["Top left", "Top right", "Bottom left", "Bottom right"],
              default: "Top left", // Default value if user doesn't change it
          },
          // This is the id of the field
          borderPosition: {
              label: "Border position", // Appears next to field
              type: "select", // Makes this setting a select field
              options: ["Top", "Bottom"],
              default: "Top", // Default value if user doesn't change it
          },
          // This is the id of the field
          borderHeight: {
              label: "Border height", // Appears next to field
              type: "number", // Makes this setting a number field
              default: 5, // Default value if user doesn't change it
          },
          // This is the id of the field
          colorNotBegun: {
              label: '"Not begun" Color', // Appears next to field
              type: "color", // Makes this setting a color field
              default: "#ffffff", // Default value if user doesn't change it
          },
          // This is the id of the field
          colorCompleted: {
              label: '"Completed" Color', // Appears next to field
              type: "color", // Makes this setting a color field
              default: "#76eb99", // Default value if user doesn't change it
          },
          // This is the id of the field
          colorProgress: {
              label: '"In progress" Color', // Appears next to field
              type: "color", // Makes this setting a color field
              default: "#ffec8a", // Default value if user doesn't change it
          },
          // This is the id of the field
          colorAbandoned: {
              label: '"Abandoned" Color', // Appears next to field
              type: "color", // Makes this setting a color field
              default: "#ff7a7a", // Default value if user doesn't change it
          },
          // This is the id of the field
          blurGroups: {
              section: ['Blur (18+ content)', 'Blur all covers from specified groups (separated by ";") (ex. Naruto;One Piece)'],
              type: "string", // Makes this setting a text field
              default: "", // Default value if user doesn't change it
          },
          // This is the id of the field
          noBlurOnHover: {
              label: 'Disable blur on hover', // Appears next to field
              type: "checkbox", // Makes this setting a checkbox field
              default: false, // Default value if user doesn't change it
          },
          copySettings:
          {
              section: ['Import/Export'],
              'label': 'Copy settings', // Appears on the button
              'type': 'button', // Makes this setting a button input
              'size': 100, // Control the size of the button (default is 25)
              'click': function() { // Function to call when button is clicked
                  const result = Object.values(gmc.fields).map(item => ({
                      id: item.id,
                      value: item.value
                  }));
                  copyToClipboard(JSON.stringify(result))
              }
          },
          pasteSettings:
          {
              'label': 'Paste settings', // Appears on the button
              'type': 'button', // Makes this setting a button input
              'size': 100, // Control the size of the button (default is 25)
              'click': async function() { // Function to call when button is clicked
                  const settings = await readFromClipboard();
                  let options = [];

                  try {
                    options = JSON.parse(settings);
                  } catch {
                      return;
                  }

                  // Loop each settings and save
                  options.forEach(el => {
                      gmc.set(el.id, el.value);
                  });
                  // Save settings
                  gmc.save();
              }
          }
      },
      css: config_panel_css,
      frame: config_container,
      // Callback functions object
      events: {
          init: function () {
              let css = generateCSS(this);
              setCustomStyle(css);
              loadBlurredCovers(this);
          },
          save: function () {
              let css = generateCSS(this);
              setCustomStyle(css);
              loadBlurredCovers(this);
              this.close();
          },
      },
  });

  // Apply blur to initial loaded covers
  const loadBlurredCovers = function(GM_settings) {
      if (GM_settings == null) GM_settings = gmc;

      // Remove class from loaded items before apply
      const blurred_items = document.getElementsByClassName("cover-blur");
      Array.from(blurred_items).forEach(el => el.classList.remove("cover-blur"));

      const blur_groups_string = GM_settings.get("blurGroups");
      blur_groups = blur_groups_string.split(";");

      // Foreach word in blur_group, search elements
      blur_groups.forEach(word => {
          const divs = document.getElementsByClassName('item-group');
          Array.from(divs).forEach(item => {
              if (item.firstChild.textContent.trim() === word) {
                  // Add class to first child of parent (this will probably break at some point)
                  const parent = item.parentNode;
                  if (parent && parent.firstChild) {
                      parent.firstChild.classList.add("cover-blur");
                  }
              }
          });
      });
  };

  const generateCSS = function (GM_settings) {
      if (GM_settings == null) GM_settings = gmc;

      const not_begun_color = GM_settings.get("colorNotBegun");
      const completed_color = GM_settings.get("colorCompleted");
      const in_progress_color = GM_settings.get("colorProgress");
      const abandoned_color = GM_settings.get("colorAbandoned");
      const no_blur_on_hover = GM_settings.get("noBlurOnHover");

      let css_style = "";
      // Make libib buttons still clickable
      css_style += `
      .quick-edit-link{
          z-index: 10;
      }
      .quick-blur-link{
          position: absolute;
          height: 24px;
          width: 24px;
          top: 5px;
          left: 5px;
          border: none;
          background-color: #fff;
          background-image: url(/img/library/icons/icon-flag-item.svg);
          opacity: 0;
          border-radius: 100px;
          transition: all 0.3s ease-in-out;
          cursor: pointer;
          text-indent: -99999px;
          z-index: 10;
      }
      .item.cover:hover .quick-blur-link {
          opacity: 1;
      }
      .batch-select{
          z-index: 10;
      }
      .cover-blur{
          overflow: hidden;
      }
      .cover-blur img{
          filter: blur(8px);
      }`;
      // Disable blur on cover hover
      if(no_blur_on_hover){
          css_style += `
        .cover-blur:hover img{
          filter: blur(0px);
        }`;
      }
      // Set the save, close and reset buttons color to white id dark mode
      css_style += `
      body.dark #libib_status_config_resetLink,body.dark #libib_status_config_saveBtn,body.dark #libib_status_config_closeBtn{
      color:white!important
      }`;

      // Triangle style
      if (GM_settings.get("type") == "Triangle") {
          let triangle_position = GM_settings.get("trianglePosition");
          if (triangle_position == "Top left") {
              css_style += `
          .cover .completed.cover-wrapper::after {
              border-left-color: ${completed_color};
              border-top-color: ${completed_color};
          }
          .cover .in-progress.cover-wrapper::after {
              border-left-color: ${in_progress_color};
              border-top-color: ${in_progress_color};
          }
          .cover .abandoned.cover-wrapper::after {
              border-left-color: ${abandoned_color};
              border-top-color: ${abandoned_color};
          }
          .cover .not-begun.cover-wrapper::after {
              border-left-color: ${not_begun_color};
              border-top-color: ${not_begun_color};
          }
          `;
          } else if (triangle_position == "Top right") {
              css_style += `
              .cover .cover-wrapper::after{
              right: 0;
              left: auto;
              }
          .cover .completed.cover-wrapper::after {
              border-left-color: transparent;
              border-right-color: ${completed_color};
              border-top-color: ${completed_color};
          }
          .cover .in-progress.cover-wrapper::after {
              border-left-color: transparent;
              border-right-color: ${in_progress_color};
              border-top-color: ${in_progress_color};
          }
          .cover .abandoned.cover-wrapper::after {
              border-left-color: transparent;
              border-right-color: ${abandoned_color};
              border-top-color: ${abandoned_color};
          }
          .cover .not-begun.cover-wrapper::after {
              border-left-color: transparent;
              border-right-color: ${not_begun_color};
              border-top-color: ${not_begun_color};
          }
          `;
          } else if (triangle_position == "Bottom left") {
              css_style += `
              .cover .cover-wrapper::after{
              bottom: 0;
              top: auto;
              }
          .cover .completed.cover-wrapper::after {
              border-top-color: transparent;
              border-left-color: ${completed_color};
              border-bottom-color: ${completed_color};
          }
          .cover .in-progress.cover-wrapper::after {
              border-top-color: transparent;
              border-left-color: ${in_progress_color};
              border-bottom-color: ${in_progress_color};
          }
          .cover .abandoned.cover-wrapper::after {
              border-top-color: transparent;
              border-left-color: ${abandoned_color};
              border-bottom-color: ${abandoned_color};
          }
          .cover .not-begun.cover-wrapper::after {
              border-top-color: transparent;
              border-left-color: ${not_begun_color};
              border-bottom-color: ${not_begun_color};
          }
          `;
          } else if (triangle_position == "Bottom right") {
              css_style += `
              .cover .cover-wrapper::after{
              bottom: 0;
              top: auto;
              left: auto;
              right: 0;
              }
          .cover .completed.cover-wrapper::after {
              border-top-color: transparent;
              border-left-color: transparent;
              border-right-color: ${completed_color};
              border-bottom-color: ${completed_color};
          }
          .cover .in-progress.cover-wrapper::after {
              border-top-color: transparent;
              border-left-color: transparent;
              border-right-color: ${in_progress_color};
              border-bottom-color: ${in_progress_color};
          }
          .cover .abandoned.cover-wrapper::after {
              border-top-color: transparent;
              border-left-color: transparent;
              border-right-color: ${abandoned_color};
              border-bottom-color: ${abandoned_color};
          }
          .cover .not-begun.cover-wrapper::after {
              border-top-color: transparent;
              border-left-color: transparent;
              border-right-color: ${not_begun_color};
              border-bottom-color: ${not_begun_color};
          }
          `;
          }
      } else if (GM_settings.get("type") == "Border") {
          let border_position = GM_settings.get("borderPosition");
          let border_height = GM_settings.get("borderHeight");
          // The box-shadow prevents the click on the item, so it needs to be hidden on hover
          css_style += `
          .cover-wrapper {
              --shadow-y: ${
          border_position == "Top" ? `` : `-`
      }${border_height}px;
          }
          .cover-wrapper:hover::after {
              display:none!important;
              --shadow-y: 0px;
              transition: all 0.25s;
              transition-behavior: allow-discrete;
           }`;

          css_style += `
          .cover .cover-wrapper::before, .cover .cover-wrapper::after {
              width: 100%;
              height: 100%;
              border-radius: 4px;
              display: block;
              border: none;
              z-index: 0;
          }
          .cover .completed.cover-wrapper::after {
              box-shadow: inset 0px var(--shadow-y) ${completed_color};
          }
          .cover .in-progress.cover-wrapper::after {
              box-shadow: inset 0px var(--shadow-y) ${in_progress_color};
          }
          .cover .abandoned.cover-wrapper::after {
              box-shadow: inset 0px var(--shadow-y) ${abandoned_color};
          }
          .cover .not-begun.cover-wrapper::after {
              box-shadow: inset 0px var(--shadow-y) ${not_begun_color};
          }
          `;
      }
      return css_style;
  };

  const setCustomStyle = function (css) {
      // Remove existing style if present
      const existingStyle = document.getElementById(
          "libib-custom-status-indicator-style"
      );
      if (existingStyle != null) {
          existingStyle.remove();
      }

      // Add style tag to document
      document.head.append(
          Object.assign(document.createElement("style"), {
              type: "text/css",
              id: "libib-custom-status-indicator-style",
              textContent: css,
          })
      );
  };

  // Add the item group to the 'blurGroups' if not present, if already present remove it
  const toggleBlurForGroup = (div) => {
      // Search for the span containing the item group
      const span = div.target.parentNode.parentNode.querySelectorAll(".item-group>span");
      if(span.length != 1) return;

      // Create array from blurredGroups string
      let blurred_groups_string = gmc.get("blurGroups");
      if(blurred_groups_string == null) return;
      let blurred_groups = blurred_groups_string.split(";");
      let item_group = span[0].innerText;
      const index = blurred_groups.indexOf(item_group);
      // If item found, remove it
      if(index > -1) blurred_groups.splice(index, 1);
      // If not found, add to array
      else blurred_groups.push(item_group);

      // Save to settings
      gmc.set("blurGroups", blurred_groups.join(";"));
      gmc.save();
  }
  // Create the button for flagging groups to blur
  const createSetBlurButton = () => {
      const newDiv = document.createElement("div");
      newDiv.classList.add("quick-blur-link");
      newDiv.title = "Toggle blur for group";
      newDiv.addEventListener("click",toggleBlurForGroup);
      return newDiv;
  }
  // Check if the group of this item needs to be blurred
  const divNeedsBlur = (div) => {
      const spans = div.querySelectorAll('span');
      return Array.from(spans).some(span => span.parentNode.classList.contains("item-group") && blur_groups.includes(span.textContent.trim()) );
  }
  const divIsCover = (div) => {
      if(div.classList.contains("cover")) return true;
      return false;
  }

  // Run when new books get loaded on the page
  // Check new nodes
  function findDivInNode(node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName.toLowerCase() === 'div' && divIsCover(node)) {
              node.firstChild.appendChild(createSetBlurButton());
              if(divNeedsBlur(node)){
                  node.firstChild.classList.add("cover-blur");
              }
          }
      }
  }

  // Setup observer
  const blur_observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
              findDivInNode(node);
          }
      }
  });

  // Start observer
  blur_observer.observe(document.body, { childList: true, subtree: true });

})();