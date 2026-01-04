// ==UserScript==
// @name        MySSHAlias
// @name:zh-CN        MySSHAlias
// @namespace   https://greasyfork.org/users/681572-q962
// @match       https://github.com/*
// @version     1.2
// @author      q962
// @license     MIT
// @description Add a custom ssh alias for Github
// @description:zh-CN  为 Github 添加自定义的 ssh 别名
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/533248/MySSHAlias.user.js
// @updateURL https://update.greasyfork.org/scripts/533248/MySSHAlias.meta.js
// ==/UserScript==

let meta_user_login = document.querySelector('[name="user-login"]') || {}
let current_user_repositorie = location.pathname.split('/').at(1)

if( meta_user_login.content != current_user_repositorie ) return

GM_addStyle(`
.alias_input_elem {
  margin-right: 1em;
}
`);

let primerPortalRoot;

function get_repository_path(){
  let parts = location.pathname.split('/')

  return parts[1] + '/' + parts[2]
}

const observer = new MutationObserver(function (mutationsList, observer) {
  if (!document.querySelector("#repository-container-header:not([hidden])"))
    return;

  for (const mutation of mutationsList) {
    for (const target of mutation.addedNodes) {
      if (target.nodeType != Node.ELEMENT_NODE) continue;

      if (
        target.parentElement &&
        target.parentElement.id == "__primerPortalRoot__"
      ) {
        primerPortalRoot = target.parentElement;

        let terminal_icon_elem = target.querySelector(".octicon-terminal");
        if (!terminal_icon_elem) continue;

        let clone_title_elem = terminal_icon_elem.nextElementSibling;
        if (!clone_title_elem) continue;

        let alias_input_box_elem = clone_title_elem.cloneNode();
        clone_title_elem.parentElement.insertBefore(
          alias_input_box_elem,
          clone_title_elem.nextElementSibling
        );

        let alias_input_elem = document.createElement("input");

        alias_input_elem.value = GM_getValue("alias") || "";
        alias_input_elem.className =
          "form-control input-monospace input-sm color-bg-subtle alias_input_elem";
        alias_input_elem.readOnly = false;
        alias_input_elem.placeholder = "ssh alias";
        alias_input_elem.addEventListener("keyup", (event) => {
          GM_setValue("alias", event.target.value);

          let alias = event.target.value || "github.com"

          let my_ssh_alias_url_elem = primerPortalRoot.querySelector(
            ".my_ssh_alias_url_elem"
          );
          if (my_ssh_alias_url_elem)
            my_ssh_alias_url_elem.value = `git@${alias}:${get_repository_path()}.git`;
        });

        alias_input_box_elem.appendChild(alias_input_elem);
      }

      if (!primerPortalRoot) continue;

      let my_ssh_alias_url_elem = primerPortalRoot.querySelector(
        ".my_ssh_alias_url_elem"
      );

      let clone_with_ssh_elem = target.querySelector("#clone-with-ssh");
      if (!my_ssh_alias_url_elem && clone_with_ssh_elem) {
        let url_input_container =
          clone_with_ssh_elem.parentElement.cloneNode(true);
        let input_elem = url_input_container.querySelector("#clone-with-ssh");
        input_elem.id = "";
        input_elem.setAttribute("value", "");

        let alias = GM_getValue("alias") || "github.com";
        input_elem.value = `git@${alias}:${get_repository_path()}.git`;

        input_elem.nextElementSibling.addEventListener("click", () => {
          GM_setClipboard(input_elem.value);
        });

        my_ssh_alias_url_elem = input_elem;
        my_ssh_alias_url_elem.classList.add("my_ssh_alias_url_elem");

        clone_with_ssh_elem.parentElement.parentElement.insertBefore(
          url_input_container,
          clone_with_ssh_elem.parentElement
        );
      }

      if (my_ssh_alias_url_elem) {
        if (primerPortalRoot.querySelector("#clone-with-ssh"))
          my_ssh_alias_url_elem.parentElement.removeAttribute("hidden");
        else my_ssh_alias_url_elem.parentElement.setAttribute("hidden", "");
      }
    }
  }
});
observer.observe(document, { childList: true, subtree: true });

// Your new project

try {
  let parent_elem = document.querySelector('#empty-setup-clone-url').parentElement.parentElement.parentElement.parentElement
  let parent_elem_2 = parent_elem.cloneNode(true)

  let url_input = parent_elem_2.querySelector('#empty-setup-clone-url')
  url_input.removeAttribute('id')

  let alias = GM_getValue("alias") || "github.com";
  url_input.value = `git@${alias}:${get_repository_path()}.git`;

  let copy_btn = url_input.nextElementSibling
  copy_btn.addEventListener("click", () => {
    GM_setClipboard(url_input.value);
  });
  parent_elem.parentElement.insertBefore(parent_elem_2, parent_elem.nextElementSibling)

  parent_elem_2.querySelector('button[data-ga-click~="HTTPS"]').parentElement.remove()
} catch(error){}
