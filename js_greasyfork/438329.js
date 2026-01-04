// Online IDE Support JS

// GLOBAL EVENT LISTENER
const addEventListenerAll = (target, listener, ...otherArguments) => {
    // install listeners for all natively triggered events
    for (const key in target) {
      if (/^on/.test(key)) {
        const eventType = key.substr(2);
        target.addEventListener(eventType, listener, ...otherArguments);
      }
    }
  
    // dynamically install listeners for all manually triggered events, just-in-time before they're dispatched ;D
    const dispatchEvent_original = EventTarget.prototype.dispatchEvent;
    function dispatchEvent(event) {
      target.addEventListener(event.type, listener, ...otherArguments);  // multiple identical listeners are automatically discarded
      dispatchEvent_original.apply(this, arguments);
    }
    EventTarget.prototype.dispatchEvent = dispatchEvent;
    if (EventTarget.prototype.dispatchEvent !== dispatchEvent) throw new Error(`Browser is smarter than you think!`);
  };
  
  
  let demo;
  let sources;
  let initCounter = 10;
  let defaultVersion = `2.29.0`;
  const deprecatedEvents = {
    dropdown: [`getValue`]
  };
   
  const pen = {
    actions: {
      log: (msg) => {
        if (demo.log !== `off`) {
          const logEl = pen.elements.logContent;
          pen.elements.logLabel.classList.add(`highlight`);
          setTimeout(() => {
            pen.elements.logLabel.classList.remove(`highlight`);
          }, 500);
          logEl.innerText = `${msg}\n${logEl.innerText}`;
          if (msg) console.log(msg);
        }
      },
      api: {
        addButton: (lText, lAction) => {
          if (typeof lText === `string`) {
            const newButton = pen.utils.createElement(`button`, {
              role: `button`,
              type: `button`,
              class: `dds__btn dds__btn-primary dds__btn-sm dds__button dds__button--mini dds__text-truncate`,
              text: lText
            });
            newButton.addEventListener(`click`, (e) => {
              let actionResponse;
              setTimeout(() => {
                if (lAction.length > 0) {
                  try {
                    actionResponse = lAction(document.querySelector(`.dds__side-nav__item`));
                  } catch (e) {
                    try {
                      actionResponse = lAction("0");
                    } catch (e) {
                      try {
                        actionResponse = lAction(["0"]);
                      } catch (e) {
                        try {
                          actionResponse = lAction([0]);
                        } catch (e) {
                          try {
                            actionResponse = lAction(new Date());
                          } catch (e) {
                            try {
                              actionResponse = lAction({ "alignment": "end" });
                            } catch (e) {
                              try {
                                actionResponse = lAction(0);
                              } catch (e) {
                                try {
                                  actionResponse = lAction(0, `descending`);
                                } catch (e) {
                                  try {
                                    actionResponse = lAction("1");
                                  } catch (e) {
                                    console.error(e);
                                    actionResponse = lAction();
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                } else {
                  actionResponse = lAction();
                }
              });
              if (actionResponse) pen.actions.log(actionResponse);
            });
            pen.elements.apiContent.appendChild(newButton);
          } else { // presume we are moving an existing element to the pen nav
            pen.elements.apiContent.appendChild(lText);
          }
        }
      },
    },
    elements: {
      logId: `log`,
      apiId: `api`,
    },
    utils: {
      addStyle: (styles) => {
        /* Create style document */
        var css = document.createElement('style');
        css.type = 'text/css';
        if (css.styleSheet)
          css.styleSheet.cssText = styles;
        else
          css.appendChild(document.createTextNode(styles));
        /* Append style to the tag name */
        document.getElementsByTagName("head")[0].appendChild(css);
      },
      arraysEqual: (first, second) => {
        if(first.length !== second.length){
          return false;
        };
        for(let i = 0; i < first.length; i++){
          if(!second.includes(first[i])){
            return false;
          };
        };
        return true;
      },
      arrayRemove: (arr, value) => { 
          return arr.filter(function(ele){ 
              return ele != value; 
          });
      },
      /**
      * converts camelCased words into dashed-cased ones
      * @param {string} key - a string with some number of capitalized letters
      * @return {string} a dashed version of whatever string was entered
      */
      camelDash: (key) => {
          return key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
      },
      /**
      * converts kebab-case words into camelCase ones
      * @param {string} key - a string with some number of dashes
      * @return {string} a camelCase version of whatever string was entered
      */
      dashCamel: function (key) {
        return key.replace(/-[a-z]/g, (m) => m.toUpperCase().replace(/-/gi, ""));
      },
      debounce: (func, timeout = 780) => {
          let timer;
          return (...args) => {
              clearTimeout(timer);
              timer = setTimeout(() => {
                  func.apply(this, args);
              }, timeout);
          };
      },
      capitalize: (what) => {
        return what.charAt(0).toUpperCase() + what.slice(1);
      },
      createElement: (nodeType, props) => {
        const domNode = document.createElement(nodeType);
        if (props && "object" === typeof props) {
          for (const prop in props) {
            if (prop === "html") {
              domNode.innerHTML = props[prop];
            } else if (prop === "text") {
              domNode.textContent = props[prop];
            } else {
              if (prop.slice(0, 5) === "aria_" || prop.slice(0, 4) === "data_") {
                const attr = prop.slice(0, 4) + "-" + prop.slice(5);
                domNode.setAttribute(attr, props[prop]);
              } else {
                domNode.setAttribute(prop, props[prop]);
              }
            }
            // Set attributes on the element if passed
            if (["role", "aria-label"].includes(prop)) domNode.setAttribute(prop, props[prop]);
          }
        }
        return domNode;
      },
      random: (min = 100000000, max = 999999999) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
      },
      load: (script) => {
        document.write('<'+'script src="'+script+'" type="text/javascript"><' + '/script>');
      },
    },
    initialize: () => {
      if (demo == null) {
        setTimeout(() => {
          initCounter--;
          if (initCounter > 0) {
            pen.initialize();
          }
        }, 50);
        if (initCounter === 1) {
          const penLay = document.getElementById(`penlay`);
          if (penLay) penLay.remove();
          demo = {
            version: defaultVersion
          };
          sources = pen.addLinks();
        }
        return;
      }
      if (demo.version) {
        sources = pen.addLinks();
      }
      setTimeout(() => {
        const penLay = document.getElementById(`penlay`);
        if (penLay) penLay.remove();
        if (!demo.components) {
            demo.components = [];
            demo.components.push({ // for backward compatibility
              selector: demo.selector,
              options: demo.options,
            });
        }
        demo.components.forEach(demoComp => {
          const method = pen.utils.capitalize(pen.utils.dashCamel(demoComp.selector));
          document.querySelectorAll(`[data-dds="${demoComp.selector}"]`).forEach((element) => {
            if (!element[method]) {
                demoComp.api = DDS[method](element, demoComp.options);
            } else {
                demoComp.api = element[method];
            }
          });
        });
        Object.keys(pen.elements).forEach(key => {
          if (key.indexOf(`Id`) > 0) {
            const elString = key.replace(`Id`, ``);
            pen.elements[elString] = pen.utils.createElement(`div`, {
              id: elString,
            });
            if (elString === 'log' && (demo.log == null || demo.log !== `open`)) {
              pen.elements[elString].classList.add(`closed`);
            }
            if (elString === 'log' && (demo.log === `off` || demo.log === false)) {
              pen.elements[elString].classList.add(`pen__none`);
            }
            if (elString === 'api' && (demo.api == null || demo.api !== `open`)) {
              pen.elements[elString].classList.add(`closed`);
            }
            if (elString === 'api' && (demo.api === `off` || demo.api === false)) {
              pen.elements[elString].classList.add(`pen__none`);
            }
            pen.elements[`${elString}Label`] = pen.utils.createElement(`div`, {
              class: `label`
            });
            pen.elements[`${elString}Label`].innerText = elString;
   
            pen.elements[`${elString}Content`] = pen.utils.createElement(`div`, {
              class: `content`
            });
          }
        });
        Object.keys(pen.elements).forEach(key => {
          if (!key.match(/(Id|Label|Content)/g)) {
            document.querySelector(`body`).appendChild(pen.elements[key]);
            pen.elements[key].appendChild(pen.elements[`${key}Label`]);
            pen.elements[key].appendChild(pen.elements[`${key}Content`]);
          }
          if (key.indexOf(`Label`) > 0) {
            pen.elements[key].addEventListener(`click`, () => {
              pen.elements[key.replace(`Label`, ``)].classList.toggle(`closed`);
            });
          }
        });
   
        let hasDispose = false;
        demo.components.forEach(demoComp => {
            const comp = demoComp.api;
            if (comp) {
                const method = pen.utils.capitalize(pen.utils.dashCamel(demoComp.selector));
                Object.keys(comp).forEach((key, index) => {
                  const selectorScript = `document.querySelector('[data-dds="${demoComp.selector}"]').${method}`;
                  if (typeof comp[key] === `function`) {
                    if (key !== `dispose`) {
                      if (!deprecatedEvents[demoComp.selector] || !deprecatedEvents[demoComp.selector].includes(key)) {
                        const parameterCount = comp[key].length;
                        let comment = parameterCount > 0 ? ` // takes ${parameterCount} parameters` : ``;
                        pen.actions.api.addButton(key, comp[key]);
                        const logComment = `${selectorScript}.${key}();${comment}`;
                        pen.actions.log(logComment);
                      }
                    } else {
                      hasDispose = true;
                      pen.actions.log(`${selectorScript}.dispose()`);
                    }
                  } else {
                    pen.actions.log(`${selectorScript}.${key} = ${comp[key]}`);
                  }
              });
              pen.actions.log(`:::::::::::::::::::::::::::::::::::::::::::::::::::`);
              pen.actions.log(`\n\n${demoComp.selector} properties / methods:::::::::::::::::::::::`);
         
              hasDispose && (pen.actions.api.addButton(`dispose`, () => {
                comp[`dispose`]();
                pen.elements.api.querySelectorAll(`button`).forEach(b => b.disabled = `true`);
              }));
         
         
              addEventListenerAll(window, (evt) => {
                  if (!evt.type.match(/dds|ddv/)) {
                    return;
                  }
                  let detail = JSON.stringify(evt.detail) || JSON.stringify(evt) || ``;
                  pen.actions.log(`${evt.type} was fired with {event}.detail = ${detail}`);
              });
  
              pen.actions.log(`::::::::::::::::::::::::::::::::::::::`);
              pen.actions.log(`\n${demoComp.selector} events:::::::::::::::::::::::`);
              
              // BEGIN LOGGING INITIALIZATION
              pen.actions.log(`
    let components = [];
    document.querySelectorAll('[data-dds="${demoComp.selector}"]').forEach((element) => {
        components.push(DDS.${method}(element));
    });
              `);
              sources.scripts.forEach(scrp => {        
                pen.actions.log(`<script src="${scrp}"></script>`);
              })
              sources.styles.forEach(styl => {        
                pen.actions.log(`<link rel="stylesheet" crossorigin href="${styl}" />`);
              })
              pen.actions.log(`::::::::::::::::::::::::::::::::::::::`);
              pen.actions.log(`\n INITIALIZATION :::::::::::::::::::::::`);
            }
          });
        }, 500);
    },
    addLinks: () => {
      const links = [
        `https://dds.dell.com/components/${demo.version}/css/dds-reboot.min.css`,
        `https://dds.dell.com/components/${demo.version}/css/dds-fonts.min.css`,
        `https://dds.dell.com/components/${demo.version}/css/dds-icons.min.css`,
        `https://dds.dell.com/components/${demo.version}/css/dds-helpers.min.css`,
        `https://dds.dell.com/components/${demo.version}/css/dds-main.min.css`,
      ];
      links.forEach((href) => {
        let link = pen.utils.createElement(`link`, {
          rel: 'stylesheet',
          crossorigin: '',
          href: href,
          'data-dds': 'stylesheet',
        });
        document.querySelector(`head`).appendChild(link);
      });
      // DOESN'T WORK pen.utils.load(`https://dds.dell.com/components/${demo.version}/js/index.min.js`);
   
      const scripts = [`https://dds.dell.com/components/${demo.version}/js/index.min.js`];
      scripts.forEach((href) => {
        let scrp = pen.utils.createElement(`script`, {
          type: `text/javascript`,
          src: href,
          'data-dds': 'script',
        });
        document.querySelector(`head`).appendChild(scrp);
      });
      pen.ready = true;
      return {
        styles: links,
        scripts: scripts,
      }
    },
    removeLinks: () => {
      document.querySelectorAll(`[data-dds="stylesheet"]`).forEach(stylesheet => {
          stylesheet.remove(); 
      });
      document.querySelectorAll(`[data-dds="script"]`).forEach(script => {
          script.remove(); 
      });
    },
    addCss: () => {
      pen.utils.addStyle(`
  body {
    max-width: 1900px !important;
    padding: 5rem 4rem !important;
  }
  #log,
  #api {
      transition: all 0.5s ease-in-out;
      position: absolute;
      z-index: 9999;
      height: 49vh;
      width: 80%;
      top: 50%;
      margin-left: 5%;
      color: white;
      background: black;
      font-size: 0.7rem;
      font-family: monospace;
      line-height: 0.9rem;
      padding: 1rem;
      border-bottom-right-radius: 0.625rem;
  }
   
  #log .label,
  #api .label {
      font-family: Roboto;
      background: black;
      color: white;
      position: relative;
      float: right;
      top: .7rem;
      left: 4rem;
      max-width: 6rem;
      min-width: 5.25rem;
      text-align: center;
      padding: 0.5rem 0.625rem;
      transform: rotate(-90deg);
      cursor: pointer;
      border-bottom-right-radius: 0.625rem;
      border-bottom-left-radius: 0.625rem;
      white-space: nowrap;
  }
  #log .content {
    position: relative;
    top: -2rem;
    width: 98%;
    max-height: 46vh;
    overflow: auto;
  }
   
  .highlight {
    background: rgb(2,0,36) !important;
    background: linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%) !important;
  }
   
  #api {
      top: 0;
      height: unset;
      min-height: 4.55rem;
      background: aliceblue;
      padding: 0.625rem;
  }
   
  #api button {
    margin-left: 0.3rem;
    margin-bottom: 0.1rem;
  }
   
  #api .label {
      top: 0;
      background: aliceblue;
      color: black;
      font-weight: bold;
  }
   
  .closed {
      transform: translateX(-110%);
  }
  .pen__none {
      display: none;
  }
   
  .content::-webkit-scrollbar {
      width: 15px;
  }
   
  .content::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 15px;
  }
   
  .content::-webkit-scrollbar-thumb {
      border-radius: 15px;
      background: rgba(255, 255, 255, 0.15);
  }
   
  `);
    },
    addButton: (options = {
      label: `label`,
      callback: () => {console.log(`callback`);},
      target: undefined,
      class: undefined
    },
    deprecated1,
    deprecated2,
    ) => {
      if (typeof options == `string`) {
          options = {
              label: options,
              callback: deprecated1,
              target: deprecated2,
          }
      }
      if (typeof options.target === 'string') {
          options.target = document.querySelector(options.target);
      }
      if (!options.class) {
          options.class = `dds__button--mini`;
      }
      const btnId = options.label.replace(/[^0-9a-zA-Z]+/, ``);
      const newBtn = pen.utils.createElement(`button`, {
          id: btnId,
        role: `button`,
        type: `button`,
        class: `dds__btn dds__btn-primary dds__btn-sm dds__button ${options.class} dds__text-truncate`,
        text: options.label,
        style: `margin-right: 0.625rem; margin-bottom: 0.625rem;`,
      });
      newBtn.addEventListener(`click`, options.callback);
      if (!document.getElementById(btnId)) {
          if (options.target) {
              options.target.appendChild(newBtn);
          } else {
            document.querySelector(`body`).prepend(newBtn);
          }
      }
    },
    whenReady: (callback) => {
      if (!pen.ready) {
          setTimeout(() => {
              pen.whenReady(callback);
          }, 100);
      } else {
          setTimeout(() => {
              callback();
          }, 500);
      }
    },
    reset: () => {
      demo.components.forEach(demoComp => {
          const method = pen.utils.capitalize(pen.utils.dashCamel(demoComp.selector));
       
          // remove element properties
          document.querySelectorAll(`[data-dds="${demoComp.selector}"]`).forEach((element) => {
              element[method] = undefined;
          });
       
          // dispose of components
          try {
          demoComp.api.dispose();
          } catch (err) {
             console.log(err);
          }
          demoComp.api = undefined;
      });
   
      // dispose of library
      DDS = undefined;
   
      // remove pen elements
      document.getElementById("log").remove();
      document.getElementById("api").remove();
   
      pen.removeLinks();
      pen.ready = false;
      pen.showLoader();
    },
    showLoader: () => {
      const penlay = pen.utils.createElement(`div`, {
        id: `penlay`,
        style: `
        background-color: white;
        overflow:hidden;
        position:absolute;
        top:0px;
        right:0px;
        bottom:0px;
        left:0px;
        z-index: 99999999;
        `
      });
      penlay.innerHTML = `<div class="dds__loading-indicator">
        <div class="dds__loading-indicator__spinner"></div>
      </div>`;
      document.querySelector(`body`).appendChild(penlay);
    }
  };
   
  pen.showLoader();
   
  (() => {
    pen.addCss();
    setTimeout(() => {
      pen.initialize();
    }, 1000)
  })();
  