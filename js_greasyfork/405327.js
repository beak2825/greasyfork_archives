// ==UserScript==
// @name         Epicsauce93
// @namespace    epicsauce93
// @version      1.2.1
// @description  An extension for Myspace93.
// @author       1024x2
// @match        https://myspace.windows93.net/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/405327/Epicsauce93.user.js
// @updateURL https://update.greasyfork.org/scripts/405327/Epicsauce93.meta.js
// ==/UserScript==

(function() {
  // Make pages with many people on it not fuck your browser
  for (let el of [...document.getElementsByTagName("img")]) {
    el.loading = "lazy";
  }

  let ls;
  try {
    ls = JSON.parse(localStorage.getItem("epicsauce93"));
  } catch (err) {
    console.error(err);
    ls = {};
  }

  let CONFIG = Object.assign({
    disableCSS: false,
    autoplayMusic: false,
    blacklistCSS: ""
  }, ls);

  const saveConfig = () => localStorage.setItem("epicsauce93", JSON.stringify(CONFIG));

  saveConfig();

  const ifPage = (path, func) => {
    if ((Array.isArray(path) && path.includes(location.pathname)) ||
      (path.test && path.test(location.pathname)) ||
      location.pathname == path) {
      func();
      return true;
    } else {
      return false;
    }
  }

  /////////////////
  // CONFIG PAGE //
  /////////////////
  ifPage("/__epicsauce93", () => {
    document.open();
    document.write(`<!DOCTYPE html>
<html>
  <head>
    <link rel="icon" type="image/png" href="favicon.png">
    <title>Epicsauce93 Options</title>
  </head>
  <body>
    <h1>Epicsauce93 Options</h1>
    awesome :)<br>
    <h2>General</h2>
    <input type="checkbox" id="disableCSS"> Disable CSS Globally<br>
    <input type="checkbox" id="autoplayMusic"> Autoplay Music<br>
    Blacklisted CSS ids:
    <textarea id="blacklistCSS"></textarea>
    <hr>
    <button onclick="save()">SAVE</button>
    <hr>
    <h1>ChangeLog</h1>
    <ul>
      <li>
        <b>1.2.1</b> Fix "Accept All".
      </li>
      <li>
        <b>1.2.0</b> Add CSS bans.
      </li>
      <li>
        <b>1.1.0</b> Remove JS loading and add proper titles.
      </li>
      <li>
        <b>1.0.2</b> Improved Disable CSS Globally, instead of removing the option it makes it disabled by default.
      </li>
    </ul>
  </body>
</html>
`);
    document.close();

    window.warn = a => {
      if (document.getElementById(a).checked) {
        document.getElementById(a).checked = confirm("Are you REALLY sure you want to enable '" + a + "'?\nOnly click 'OK' if you know what you're doing!");
      }
    };

    for (let entry in CONFIG) {
      if (typeof CONFIG[entry] == "boolean") {
        document.getElementById(entry).checked = CONFIG[entry];
      } else {
        document.getElementById(entry).value = CONFIG[entry];
      }
    }

    window.save = () => {
      for (let entry in CONFIG) {
        let el = document.getElementById(entry);
        if (el.type == "checkbox") {
          CONFIG[entry] = el.checked;
        } else {
          CONFIG[entry] = el.value;
        }
      }
      localStorage.setItem("epicsauce93", JSON.stringify(CONFIG));
      alert("Saved!");
    };
  });

  // OPTBOX
  let optBox = document.createElement("div");
  optBox.setAttribute("style", "bottom: 0px !important;\
right: 0px !important;\
position: fixed !important;\
z-index: 2147483647 !important;\
background: rgb(255, 255, 255) none repeat scroll 0% 0% !important;\
color: rgb(0, 0, 0) !important;\
display: block !important;\
font-family: sans-serif !important;\
font-size: 16px !important;\
transform: none !important;\
opacity: 1 !important;");
  document.body.appendChild(optBox);

  let space = () => optBox.appendChild(document.createTextNode(" "));

  const link = (label, title = "", color = "#000", onclick = () => {}) => {
    const btn = document.createElement("a");
    btn.href = "#";
    btn.title = title;
    btn.innerText = label;
    btn.onclick = onclick;
    btn.setAttribute("style", "position: static !important;\
display: inline !important;\
opacity: 1 !important;\
transform: none !important;\
color: " + color + " !important;");
    optBox.appendChild(btn);

    return btn;
  };

  // user count
  ifPage(["/all.php", "/online.php"], () => {
    const name = document.getElementsByClassName("allfwieds")[0].children[1];
    name.innerText += " (" + document.getElementsByClassName("allfwiedsItem").length + ")"
  });

  ifPage("/requests.php", () => {
    if (document.getElementsByClassName("friendRequests").length > 0) {
      // ADD ALL
      const addAll = link("Accept All", "Accept all friend requests", "green", async () => {
        addAll.style.display = "none";

        let div = document.createElement("span");
        div.innerText = "Please wait...";
        optBox.insertBefore(div, addAll);

        for (let user of document.getElementsByClassName("friendRequests")) {
          let id = user.querySelector("a[href^=index]").href.match(/index\.php\?id=([0-9]+)$/)[1];
          let res = await fetch("https://myspace.windows93.net/accept.php?id=" + id);

          if (res.ok) {
            user.children[0].style.display = "none";
            user.appendChild(document.createTextNode("Added"));
          } else {
            div.innerText = res.statusCode;
            alert("Oops! Code " + res.statusCode);
            return;
          }
        }

        alert("Done!");
        div.innerText = "Done!";
      })

      space();
    } else {
      document.getElementById("userWall").children[1].innerText = "You have no friend requests, you silly goose!";
    }
  });

  // USERPAGE
  if (!CONFIG.autoplayMusic) {
    for (let audio of document.getElementsByTagName("audio")) {
      audio.pause();
      audio.autoplay = false;
    }
  }

  ifPage(["/", "/index.php", "/blog.php"], () => {
    const ID = new URLSearchParams(window.location.search).get("id");

    document.title = document.getElementById("name").innerText + "'s Profile | MYSPACE";

    const CSSel = document.getElementById("container").children[1];

    if (CSSel.tagName === "STYLE") {
      // CSS TOGGLER
      const CSS = CSSel.innerText;

      const badCSS = CONFIG.blacklistCSS
        .trim()
        .split("\n");

      if (CONFIG.disableCSS || badCSS.includes(ID)) {
        CSSel.innerText = "/* disabled */";
      }

      let enableCSS = document.createElement("input");
      enableCSS.setAttribute("style", "position: static !important;\
display: inline !important;\
opacity: 1 !important;\
transform: none !important;\
");
      enableCSS.type = "checkbox";
      enableCSS.checked = CSSel.innerText !== "/* disabled */";
      enableCSS.onchange = () => {
        CSSel.innerText = enableCSS.checked ? CSS : "/* disabled */";
      };
      optBox.appendChild(enableCSS);

      optBox.appendChild(document.createTextNode("CSS "));

      document.addEventListener("keyup", e => {
        if (e.key == "c" && e.altKey) {
          enableCSS.checked = !enableCSS.checked;
          CSSel.innerText = enableCSS.checked ? CSS : "/* disabled */";
        }
      })

      space();

      if (!badCSS.includes(ID)) {
        let ban = link("🔨", "Ban this user's CSS", "red", () => {
          if (confirm("Are you sure you want to ban this user's CSS theme?")) {
            CONFIG.blacklistCSS += ID + "\n";
            saveConfig();

            CSSel.innerText = "/* disabled */";
            enableCSS.checked = false;
            ban.remove();
          }
        });

        space();
      }
    }
  });

  // BLOG
  ifPage("/blog.php", () => {
    if (document.querySelectorAll(".comments > .comments").length > 1) {
      // BLOG LIST
      document.title = document.getElementById("name").innerText + " | MYSPACE";
    } else if (document.getElementsByClassName("blog")[0]) {
      document.title = document.querySelector(".blog > a > .blogCorpus > h1").innerText +
        " | " + document.getElementById("name").innerText + " | MYSPACE";
    }
  });

  // Backup plan for titlebar
  if (document.title === "MYSPACE") {
    const pathname = location.pathname.substr(1).split(".")[0];
    const name = pathname.charAt(0).toUpperCase() +
      pathname.substr(1);

    document.title = name + " | MYSPACE";
  }

  // OPTIONS BUTTON
  const optsBtn = link("⚙️", "Configure Epicsauce93");
  optsBtn.href = "/__epicsauce93";
  optsBtn.target = "_blank";

  space();

  // CLOSE BUTTON
  const pissOff = link("X", "Close the view", "#f00", () => {
    optBox.style.display = "none";
  });
  optBox.appendChild(pissOff);
})();
