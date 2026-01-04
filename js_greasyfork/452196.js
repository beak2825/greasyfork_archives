// ==UserScript==
// @name         InkBrowser
// @version      0.1
// @author       twilightstormshi@gmail.com
// @namespace    ibb
// @license      Copyright 2022 Evan Messinger (twilightstormshi@gmail.com) Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software, and the donation link and menu item shall remain in the Software and unchanged from their original version, available https://greasyfork.org/en/scripts/452196-inkbrowser  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// @description  InkBunny Browser provides an overlay for inkbunny.net, using the Inkbunny API ( https://wiki.inkbunny.net/wiki/API ). You can browse images fullscreen from artists' galleries and listing pages such as New Submissions, without having to go back and forth between individual submission pages.
// @match        https://inkbunny.net/submissionsviewall.php*
// @match        https://inkbunny.net/gallery/*
// @run-at       document-idle
// @noframes
// @grant        GM_setValue
// @grant        GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/452196/InkBrowser.user.js
// @updateURL https://update.greasyfork.org/scripts/452196/InkBrowser.meta.js
// ==/UserScript==
/* eslint-disable no-undef */

////UTIL

const
      functions = {},
      welcomeMessage = "Running InkBrowser version 0.1\n©twilightstormshi@gmail.com, 2022",
      newline = String.fromCharCode(13, 10),
      helpMessage = `Welcome to the Inkbrowser plugin.${newline}${newline}Log In with your Inkbunny credentials to get started.${newline}${newline}Clicking on a picture will display it fullscreen. Click again or press Escape to take it away again.${newline}${newline}Hover over the red bar on the left for stats; hover over the red bar on the right for image versions.${newline}${newline}Logging Out from the Inkbrowser menu will only log you out of Inkbrowser, not out of Inkbunny.${newline}${newline}You can enable or disable Inkbrowser at any time by clicking on the 'ACTIVE/DISABLED' button next to the menu.${newline}Please consider donating!`,
      loginURL = "https://inkbunny.net/api_login.php",
      submissionURL = "https://inkbunny.net/api_submissions.php",
      donateURL = "https://www.paypal.com/donate?business=XG5W7UGP5EL9L&no_recurring=1&currency_code=USD",
      userAgent = "InkBrowser/0.1 (Tampermonkey Overlay by twilightstormshi@gmail.com)",
      submissionPattern = /\/s\/(\d+)/,
      triggers = [...document.body.querySelectorAll(".widget_imageFromSubmission")].map(function(trigger){
        return trigger.parentElement;
      });


const element = function(tag, attr){
  const element = document.createElement(tag);
  element.classList.add("inkbrowser");
  for(const name in attr){
    if(name === "class"){
      element.classList.add(...attr[name].split(" "));
    }else if(name === "append"){
      if(Array.isArray(attr[name])){
        for(const item of attr[name]){
          element.append(item);
        }
      }else{
        element.append(attr[name]);
      }
    }else{
      element[name] = attr[name];
    }
  }
  return element;
};

////END UTIL

console.log(welcomeMessage);

////ACTIVATE

const activate = element("a", {
  class: "dir",
  id: "menu-inkbrowser-activate"
});

functions.disable = function(){
  GM_setValue("active", false);
  activate.textContent = "disabled";
  activate.classList.remove("active");
};

functions.activate = function(){
  if(GM_getValue("sid")){
    GM_setValue("active", true);
    activate.textContent = "active";
    activate.classList.add("active"); 
    return true; 
  }
  return false;
};

////END ACTIVATE

////CSS

(function(){
  const stylesheet = {
    ".inkbrowser": {
      boxSizing: "border-box"
    },
    ".inkbrowser.hide": {
      display: "none !important"
    },
    ".inkbrowser.backdrop.hide-cursor": {
      cursor: "none !important"
    },
    ".inkbrowser.popup": {
      position: "fixed",
      backgroundColor: "antiquewhite",
      width: "fit-content",
      maxWidth: "80%",
      height: "fit-content",
      maxHeight: "80%",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      border: "double black 4px",
      borderRadius: "7px",
      padding: "5px",
      zIndex: "10001"
    },
    ".inkbrowser.help": {
      whiteSpace: "pre-wrap"
    },
    "form.inkbrowser": {
      width: "100%",
      height: "100%"
    },
    ".inkbrowser.popup fieldset": {
      width: "100%",
      height: "100%",
      display: "grid",
      borderRadius: "5px"
    },
    "legend.inkbrowser": {
      textTransform: "capitalize",
      fontWeight: "600"
    },
    "label.inkbrowser": {
      textTransform: "capitalize"
    },
    "input.inkbrowser": {
      marginBottom: "2%",
      paddingLeft: "2ex",
      borderRadius: "5px"
    },
    "button.inkbrowser": {
      textTransform: "uppercase",
      fontWeight: "600",
      fontSize: "90%",
      borderRadius: "5px"
    },
    "li.inkbrowser": {
      cursor: "pointer"
    },
    ".inkbrowser.backdrop": {
      width: "100vw",
      height: "100vh",
      backgroundColor: "#6495edee",
      position: "fixed",
      top: "0",
      left: "0",
      zIndex: "10000",
      cursor: "default"
    },
    "img.inkbrowser": {
      objectFit: "contain"
    },
    ".inkbrowser.image-container": {
      width: "calc(100% - 34px)",
      height: "100%",
      margin: "0 auto"
    },
    ".inkbrowser.image-container.wide": {
      overflowY: "overlay"
    },
    ".inkbrowser.image-container.tall": {
      overflowX: "overlay"
    },
    ".inkbrowser.image-container>img": {
      width: "100%",
      height: "100%",
    },
    ".inkbrowser.image-container.wide>img": {
      height: "auto",
      width: "calc(100% - 17px)"
    },
    ".inkbrowser.image-container.tall>img": {
      height: "calc(100% - 17px)",
      width: "auto"
    },
    ".inkbrowser.dir": {
      color: "#ffffff",
      textDecoration: "none",
      boxSizing: "content-box"
    },
    "ul.inkbrowser>li>a": {
      color: "#ffffff",
      textTransform: "capitalize",
      paddingBottom: "20px",
      cursor: "pointer",
      width: "auto"
    },
    "form.inkbrowser.loading button": {
      borderColor: "#b45abaa6",
      borderStyle: "inset",
      cursor: "not-allowed"
    },
    "#menu-inkbrowser-activate": {
      borderLeft: "none",
      color: "darkblue",
    },
    "#menu-inkbrowser-activate.active": {
      color: "darkred"
    },
    "button.inkbrowser.close": {
      position: "absolute",
      right: "-3ex",
      top: "-3ex",
      paddingBottom: "0.5ex",
      paddingLeft: "1ex",
      border: "0.5ex solid red",
      color: "red",
      backgroundColor: "lightgrey",
      borderRadius: "2ex"
    },
    ".inkbrowser.sidebar": {
      borderRight: "17px solid indianred",
      left: "calc(17px - 70vw)",
      top: "0",
      width: "70vw",
      height: "100vh",
      position: "absolute",
      transition: "left 0.7s ease-out",
      backgroundColor: "floralwhite",
      zIndex: "10002",
      display: "grid",
      gridTemplateRows: "1.2rem 1fr 100%",
      gridTemplateColumns: "25% 25% 25% 25%",
      gridTemplateAreas: "'title title title title' 'stats tags tags tags' 'comments comments comments comments'"
    },
    ".inkbrowser.sidebar.open": {
      left: "0",
    },
    ".inkbrowser.versions": {
      overflowX: "hidden",
      whiteSpace: "nowrap",
      display: "flex",
      flexDirection: "column",
      gap: "1%",
      borderLeft: "17px solid indianred",
      right: "calc(17px - 30vw)",
      top: "0",
      width: "30vw",
      height: "100vh",
      position: "absolute",
      transition: "right 0.3s ease-out",
      backgroundColor: "floralwhite",
      counterReset: "versionCounter",
      zIndex: "10002"
    },
    ".inkbrowser.versions.open": {
      right: "0",
    },
    ".inkbrowser.version": {
      maxHeight: "300px",
      counterIncrement: "versionCounter"
    },
    ".inkbrowser.version>img": {
      display: "block",
      margin: "0 auto",
      maxWidth: "100%"
    },
    ".inkbrowser.version:before": {
      content: "counter(versionCounter)",
      position: "absolute",
      left: "0",
      marginTop: "1ex",
      marginLeft: "1ex",
      padding: "0.5em 0.7em 0.35em 0.7em",
      border: "0.5ex solid black",
      borderRadius: "50%",
      fontWeight: "600",
      backgroundColor: "aliceblue",
      opacity: "0.5"
    },
    ".inkbrowser.version.selected:before": {
      borderStyle: "dashed",
      opacity: "1"
    },
    ".inkbrowser.version.selected.loading:before": {
      borderColor: "indianred",
      animation: "spin 2.5s linear 0s infinite"
    },
    ".inkbrowser.menu": {
      display: "block",
      position: "absolute",
      zIndex: "10001",
      marginTop: "2ex",
      marginLeft: "4ex",
      cursor: "context-menu"
    },
    ".inkbrowser.title": {
      textAlign: "center",
      fontSize: "160%",
      fontWeight: "600",
      gridArea: "title"
    },
    ".inkbrowser.stats": {
      gridArea: "stats",
      display: "grid",
      justifyContent: "center",
      alignContent: "space-around",
      justifyItems: "end"
    },
    ".inkbrowser.tags": {
      gridArea: "tags"
    },
    ".inkbrowser.comments": {
      gridArea: "comments"
    }
  };

  let css = "";
  for(const selector in stylesheet){
    css += `${selector} {\n`;
    for(const rule in stylesheet[selector]){
      css += `\t${rule.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()}: ${stylesheet[selector][rule]};\n`;
    }
    css += `}\n`
  }
  css += `@keyframes spin {\n\t0% { transform: rotate(0deg); }\n\t100% { transform: rotate(360deg); }\n}`;
  document.head.append(element("style", {
    type: "text/css",
    append: css
  }));
})();

////END CSS

////LOGIN

functions.login = function(){
  let popup, form, close;
  document.body.append((popup = element("div", {
    class: "popup",
    append: [
      (close = element("button", {
        class: "close",
        append: "✖"
      })),
      (form = element("form", {
        append: element("fieldset", {
          append: [
            element("legend", {
              append: "inkbrowser login"
            }),
            element("label", {
              for: "username",
                append: "username:"
            }),
            element("input", {
              type: "text",
              name: "username",
              required: true
            }),
            element("label", {
              for: "password",
                append: "password:"
            }),
            element("input", {
              type: "password",
              name: "password",
              required: true
            }),
            element("button", {
              type: "submit",
              append: "log in"
            })
          ]
        })
      }))
    ]
  })));
  close.addEventListener("click", function(){
    popup.remove();
  });
  form.addEventListener("submit", function(event){
    event.preventDefault();
    form.classList.add("loading");
    form.querySelector("button").disabled = true;
    try{
      fetch(loginURL, {
        method: "POST",
        headers: {
          "User-Agent": userAgent
        },
        body: new URLSearchParams(new FormData(form))
      }).then(function(data){
        return data.json();
      }).then(function(json){
        GM_setValue("sid", json.sid);
        functions.activate();
        window.location.reload();
      });
    }catch(error){
      console.error(`Could not log in InkBunny!\n\n${error}`)
      form.classList.remove("loading");
      form.querySelector("button").removeAttribute("disabled");
    }
  });
};

functions.logout = function(){
  GM_setValue("sid", undefined);
  functions.disable();
  window.location.reload();
};

////END LOGIN

////HELP

functions.help = function(){
  let help, close;
  document.body.append((help = element("div", {
    class: "popup help",
    append: [
      (close = element("button", {
        class: "close",
        append: "✖"
      })),
      helpMessage
    ]
  })));
  close.addEventListener("click", function(){
    help.remove();
  });
};

////END HELP

////MENU

(function(){
  let login, logout, donate, help;
  const dropdown = document.body.querySelector(".dropdown-horizontal");
  dropdown.append(element("li", {
    append: [
      element("a", {
        class: "dir",
        id: "menu-inkbrowser",
        append: "inkbrowser"
      }),
      element("ul", {
        append: [
          element("li", {
            append: (login = element("a", {
              append: "log in"
            }))
          }),
          element("li", {
            append: (logout = element("a", {
              append: "log out"
            }))
          }),
          element("li", {
            class: "sectionstart"
          }),
          element("li", {
            append: (donate = element("a", {
              href: donateURL,
              append: "donate"
            }))
          }),
          element("li", {
            append: (help = element("a", {
              append: "help"
            }))
          })
        ]
      })
    ]
  }));
  dropdown.append(element("li", {
    append: activate
  }));
  login.addEventListener("click", functions.login);
  logout.addEventListener("click", functions.logout);
  help.addEventListener("click", functions.help);
  activate.addEventListener("click", function(){
    if(GM_getValue("active")){
      functions.disable();
    }else{
      if(!functions.activate()){
        functions.login();
      };
    }
  });
  functions.disable();
  functions.activate();
})();

////END MENU

////MAIN

(function(){
  const sid = GM_getValue("sid");
  let backdrop, image, sidebar, versions, menu, clearID, title, viewCount, favCount, favRatio, commentCount, tags;
  backdrop = element("div", {
    class: "backdrop hide",
    append: [
      element("div", {
        class: "image-container",
        append: (image = element("img"))
      }),
      (menu = element("div", {
        class: "popup menu hide",
        append: [
          element("div", {
            append: "Widen"
          })
        ]
      })),
      (sidebar = element("div", {
        class: "sidebar",
        append: [
          (title = element("div", {
            class: "title"
          })),
          element("fieldset", {
            class: "stats",
            append: [
              element("legend", {
                append: "Stats:"
              }),
              (viewCount = element("div")),
              (favCount = element("div")),
              (favRatio = element("div")),
              (commentCount = element("div"))
            ]
          }),
          element("fieldset", {
            class: "tags",
            append: [
              element("legend", {
                append: "Tags:"
              }),
              (tags = element("div"))
            ]
          }),
          element("div", {
            class: "comments"
          })
        ]
      })),
      (versions = element("div", {
        class: "versions"
      }))
    ]
  });
  document.body.append(backdrop);
  const hideCursor = function(){
    clearTimeout(clearID);
    clearID = setTimeout(function(){
      if(!sidebar.matches(".open") && !versions.matches(".open")){
        backdrop.classList.add("hide-cursor");
        clearTimeout(clearID);
        clearID = undefined;
      }
    }, 800);
  };
  const hideBackdrop = function(){
    document.documentElement.style.removeProperty("overflow");
    backdrop.classList.add("hide");
    menu.classList.add("hide");
    backdrop.classList.remove("hide-cursor");
  };
  const showBackdrop = function(){
    document.documentElement.style.overflow = "hidden";
    backdrop.classList.remove("hide");
    backdrop.classList.remove("hide-cursor");
    hideCursor();
  };
  const toggleBackdrop = function(){
    if(backdrop.matches(".hide")){
      showBackdrop();
    }else{
      hideBackdrop();
    }
  };
  const selectVersion = function(version){
    console.log(version.details);
    const previous = versions.querySelector(".selected");
    if(previous) previous.classList.remove("selected");
    version.classList.add("selected", "loading");
    image.src = version.details.file_url_full
  }
  image.addEventListener("load", function(){
    for(const version of versions.querySelectorAll(".version")){
      version.classList.remove("loading");
    }
  });
  backdrop.addEventListener("click", function(event){
    if(event.target === backdrop || event.target === image){
      hideBackdrop();
    }
  });
  backdrop.addEventListener("mousemove", function(){
    backdrop.classList.remove("hide-cursor");
    hideCursor();
  });
  // backdrop.addEventListener("contextmenu", function(event){
  //   event.preventDefault();
  //   menu.style.left = `${event.clientX}px`;
  //   menu.style.top = `${event.clientY}px`;
  //   menu.classList.remove("hide");
  // });
  document.body.addEventListener("keyup", function(event){
    if(event.key === "Escape" && image.src){
      toggleBackdrop();
    }else if(["x", "X"].includes(event.key)){
      if(image.naturalHeight > image.naturalWidth){
        image.parentElement.classList.toggle("wide");
      }else if(image.naturalWidth > image.naturalHeight){
        image.parentElement.classList.toggle("tall");
      }
    }
  });
  sidebar.addEventListener("mouseenter", function(){
    sidebar.classList.add("open");
  });
  sidebar.addEventListener("mouseleave", function(event){
    if(event.relatedTarget) sidebar.classList.remove("open");
  });
  versions.addEventListener("mouseenter", function(){
    versions.classList.add("open");
  });
  versions.addEventListener("mouseleave", function(event){
    if(event.relatedTarget) versions.classList.remove("open");
  });
  for(const trigger of triggers){
    trigger.addEventListener("click", function(event){
      if(GM_getValue("active")){
        event.preventDefault();
        try{
          const id = trigger.querySelector("a").href.match(submissionPattern)[1];
          fetch(submissionURL, {
            method: "POST",
            headers: {
              "User-Agent": userAgent
            },
            body: new URLSearchParams({
              sid: sid,
              submission_ids: id
            })
          }).then(function(data){
            return data.json();
          }).then(function(json){
            backdrop.details = json.submissions[0];
            console.log(backdrop.details);
            title.innerHTML = backdrop.details.title;
            viewCount.innerHTML = `${backdrop.details.views} views`;
            favCount.innerHTML = `${backdrop.details.favorites_count} favs`;
            favRatio.innerHTML = `${((parseInt(backdrop.details.favorites_count) / parseInt(backdrop.details.views)) * 100).toFixed(2)}% fav ratio`
            commentCount.innerHTML = `${backdrop.details.comments_count} comments`;
            tags.innerHTML = backdrop.details.keywords.map(function(tag){
              return tag.keyword_name;
            }).join(", ");
            showBackdrop();
            versions.innerHTML = "";
            for(const file of backdrop.details.files){
              const version = element("div", {
                class: "version",
                details: file,
                append: element("img", {
                  src: file.file_url_preview,
                })
              });
              versions.append(version);
              version.addEventListener("click", function(){
                selectVersion(version);
              });
              selectVersion(versions.querySelector("div:first-of-type"));
            }
          });
        }catch(error){
          console.error(`Could not fetch submission!\n\n${error}`)
        }
      }
    }, {
      capture: true
    });
  }
})();

////END MAIN