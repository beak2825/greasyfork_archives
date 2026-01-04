// ==UserScript==
// @name         Bubble Logger
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/js/bootstrap.min.js
// @require      https://cdn.jsdelivr.net/npm/renderjson@1.4.0/renderjson.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/rxjs/8.0.0-alpha.2/rxjs.umd.min.js
// @require      https://cdn.jsdelivr.net/npm/d3@7.3.0/dist/d3.min.js
// @require      https://cdn.jsdelivr.net/npm/axios@0.26.0/dist/axios.min.js
// @run-at       document-end
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license      MIT
// @description  log uncaught window (XHR.send, XHR.onerror) exceptions and write them in the document as bootstrap alert html elements
// @author       Sloppy Lo
// @match        http*://*/*
// @icon         https://store-images.s-microsoft.com/image/apps.32031.13510798887630003.b4c5c861-c9de-4301-99ce-5af68bf21fd1.ba559483-bc2c-4eb9-a17e-c302009b2690?w=180&h=180&q=60
// @resource     REMOTE_BOOTSTRAP_CSS https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css
// @resource     ANIMATE_CSS_MIN https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/440694/Bubble%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/440694/Bubble%20Logger.meta.js
// ==/UserScript==
// Info: https://sourceforge.net/p/greasemonkey/wiki/unsafeWindow/
//       https://benjamine.github.io/jsondiffpatch/demo/index.html
//       https://abodelot.github.io/jquery.json-viewer/
//       https://programming.mediatagtw.com/article/tampermonkey+unsafewindow
//       https://stackoverflow.com/questions/2631820/how-do-i-ensure-saved-click-coordinates-can-be-reload-to-the-same-place-even-if/2631931#2631931
//       http://jsfiddle.net/luisperezphd/L8pXL/
//       /nl/wlan-access-points/mikrotik/omnitik-5-poe-ac-rbomnitikpg-5hacd-art-rbomnitikpg-5hacd-num-6166159/
//       https://theonlytutorials.com/how-to-make-a-div-movable-draggable/ Missing feature: DRAGGABLE
//       https://wiki.greasespot.net/Content_Script_Injection
// IIFE
(function() {
    //Init
    "use strict";
    let id = 0;
    let masterId = 0;
    let scrolling = false;
    let stats = [];
    let timeoutId = null;
    let canonicalLinkURI, windowURI;
    let firstRun = true;
    const constants = {
      GTM: "GTM",
      ENV: "ENV"
    };
    const { GTM, ENV } = constants;
    const cache = [];
    const isIframe = (window.self === window.top);
    const $ = window.jQuery;
    const rxjs = window.rxjs;
    const axios = window.axios;
    window.dataLayer = window.dataLayer || [];
    const bubbleStates = ["primary", "danger", "warning"];
    let open = XMLHttpRequest.prototype.open;
    let send = XMLHttpRequest.prototype.send;
    console.defaultError = console.error.bind(console);
    console.errors = [];
    console.defaultWarn = console.warn.bind(console);
    console.warns = [];
    console.defaultInfo = console.info.bind(console);
    console.infos = [];
    //IIFE: Add non-rewritable styles to avoid getting affected by target website CSS's
    (function() {
      // Load remote CSS
      // @see https://github.com/Tampermonkey/tampermonkey/issues/835
      const overwriteBootrapDismissableButtonCSS = `.alert-dismissible .close {
                                                      position: absolute !important;
                                                      top: 0 !important;
                                                      right: 0 !important;
                                                      padding: 0.75rem 1.25rem !important;
                                                      color: inherit !important;
                                                      width: 40px !important;
                                                      box-shadow: none !important;
                                                      font-size: 1.5rem !important;
                                                    }`;
      GM_addStyle(overwriteBootrapDismissableButtonCSS);
      const bootstrapCss = GM_getResourceText("REMOTE_BOOTSTRAP_CSS");
      GM_addStyle(bootstrapCss);
      const animateCssMin = GM_getResourceText("ANIMATE_CSS_MIN");
      GM_addStyle(animateCssMin);
      const jsonViewerCss = `.renderjson a { text-decoration: none; }
                            .renderjson .disclosure { color: green;
                             font-size: 150%; }
                            .renderjson .syntax { color: grey; }
                            .renderjson .string { color: darkred; }
                            .renderjson .number { color: darkcyan; }
                            .renderjson .boolean { color: blueviolet; }
                            .renderjson .key    { color: darkblue; }
                            .renderjson .keyword { color: blue; }
                            .renderjson .object.syntax { color: lightseagreen; }
                            .renderjson .array.syntax  { color: orange; }
                            .containerErrors pre  { padding: 0 !important; background: no-repeat !important}`;
      GM_addStyle(jsonViewerCss);
      const customCollapse = ".customCollapse {float: right !important}";
      GM_addStyle(customCollapse);
      const spinnerCss = ".loadingio-spinner-bean-eater-m1d52hd0p4d {top:50% !important; left:50% !important} a {display: inline !important}";
      GM_addStyle(spinnerCss);
      const errorMessageCss = ".alert {word-break: break-word !important; opacity: 0.95 !important; margin: 0px !important; font-size:13px !important}";
      GM_addStyle(errorMessageCss);
      const requestsBoxCssWidth = (isIframe) ? "388px" : "351px";
      const requestsBoxCss = `.requestsBox {
                                overflow-y: scroll !important;
                                max-height: 88% !important;
                                width: ${requestsBoxCssWidth} !important;
                                position: fixed !important;
                                top: 0% !important;
                                z-index: 99999999
                                !important;
                                left: 0;
                              } .string {word-wrap: break-word !important;}`;
      GM_addStyle(requestsBoxCss);
      const spinnerDivCss = `.spinnerDiv {
                                      width: 10% !important;
                                      float: left;
                                      background-color: #1f1f22 !important
                              }`;
      GM_addStyle(spinnerDivCss);
      const buttonsDivCss = ".buttonsDiv {overflow-y: scroll !important;display: none; width: 100% !important; position: relative !important; float: left !important;} .buttonsDiv a {width: 33.3% !important; height: 31px !important; float: left !important; text-align: center !important; font-size: 12px !important; border-color: black !important; padding-top: 5px !important}";
      GM_addStyle(buttonsDivCss);
      // const responsesBoxCss = ".responsesBox {position: fixed !important; right: 0% !important; top: 70% !important; width: 50% !important; z-index: 99999999 !important; overflow-y: scroll !important;}";
      // GM_addStyle(responsesBoxCss);
      const top = (isIframe) ? "7.5%" : "26%";
      const containerErrorsCSSWidth = (isIframe) ? "388px" : "351px";
      const containerErrorsCss = `.containerErrors {
                                      display: none;
                                      max-height: 752px !important;
                                      width: ${containerErrorsCSSWidth} !important;
                                      top: ${top} !important;
                                      position: fixed !important;
                                      overflow-y: scroll !important;
                                      z-index: 99999999 !important;
                                   }
                                   .containerErrors div {
                                     font-style: normal !important;
                                   }`;
      GM_addStyle(containerErrorsCss);
      const containerSvgCss = `.svgContainer {
                                    cursor: pointer !important;
                                    left: 1%;
                                    z-index: 99999999 !important;
                               }
                               .svgContainer svg{
                                    float: left
                               }`;
      GM_addStyle(containerSvgCss);
      const objectMessagePCss = ".objectMessageP {word-break: break-word;font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji !important; font-size: 13px !important}";
      GM_addStyle(objectMessagePCss);
      const width = (isIframe) ? "90%" : "90%";
      const replDivCss = `.replDiv {
                                  display: none;
                                  height: 50px !important;
                                  width: ${width} !important;
                                  float: left !important
                          }
                          .replDiv input {
                                  background-color: #1f1f22 !important;
                                  height: 100% !important;
                                  width: 100% !important;
                                  font-size: 18px !important;
                                  border: 0 !important;
                          }`;
      GM_addStyle(replDivCss);
    })();

    //Create reference to elements
    const spinner = $("<div class=\"spinnerDiv\"><svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" style=\"margin: auto; background: none; display: block; shape-rendering: crispedges; animation-play-state: running; animation-delay: 0s;\" width=\"50px\" height=\"50px\" viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid\">  <g style=\"animation-play-state: running; animation-delay: 0s;\">    <circle cx=\"60\" cy=\"50\" r=\"4\" fill=\"#ffffff\" style=\"animation-play-state: running; animation-delay: 0s;\">      <animate attributeName=\"cx\" repeatCount=\"indefinite\" dur=\"1s\" values=\"95;35\" keyTimes=\"0;1\" begin=\"-0.67s\" style=\"animation-play-state: running; animation-delay: 0s;\"></animate>      <animate attributeName=\"fill-opacity\" repeatCount=\"indefinite\" dur=\"1s\" values=\"0;1;1\" keyTimes=\"0;0.2;1\" begin=\"-0.67s\" style=\"animation-play-state: running; animation-delay: 0s;\"></animate>    </circle>    <circle cx=\"60\" cy=\"50\" r=\"4\" fill=\"#ffffff\" style=\"animation-play-state: running; animation-delay: 0s;\">      <animate attributeName=\"cx\" repeatCount=\"indefinite\" dur=\"1s\" values=\"95;35\" keyTimes=\"0;1\" begin=\"-0.33s\" style=\"animation-play-state: running; animation-delay: 0s;\"></animate>      <animate attributeName=\"fill-opacity\" repeatCount=\"indefinite\" dur=\"1s\" values=\"0;1;1\" keyTimes=\"0;0.2;1\" begin=\"-0.33s\" style=\"animation-play-state: running; animation-delay: 0s;\"></animate>    </circle>    <circle cx=\"60\" cy=\"50\" r=\"4\" fill=\"#ffffff\" style=\"animation-play-state: running; animation-delay: 0s;\">      <animate attributeName=\"cx\" repeatCount=\"indefinite\" dur=\"1s\" values=\"95;35\" keyTimes=\"0;1\" begin=\"0s\" style=\"animation-play-state: running; animation-delay: 0s;\"></animate>      <animate attributeName=\"fill-opacity\" repeatCount=\"indefinite\" dur=\"1s\" values=\"0;1;1\" keyTimes=\"0;0.2;1\" begin=\"0s\" style=\"animation-play-state: running; animation-delay: 0s;\"></animate>    </circle>  </g><g transform=\"translate(-15 0)\" style=\"animation-play-state: running; animation-delay: 0s;\">  <path d=\"M50 50L20 50A30 30 0 0 0 80 50Z\" fill=\"#005bbf\" transform=\"rotate(90 50 50)\" style=\"animation-play-state: running; animation-delay: 0s;\"></path>  <path d=\"M50 50L20 50A30 30 0 0 0 80 50Z\" fill=\"#005bbf\" style=\"animation-play-state: running; animation-delay: 0s;\">    <animateTransform attributeName=\"transform\" type=\"rotate\" repeatCount=\"indefinite\" dur=\"1s\" values=\"0 50 50;45 50 50;0 50 50\" keyTimes=\"0;0.5;1\" style=\"animation-play-state: running; animation-delay: 0s;\"></animateTransform>  </path>  <path d=\"M50 50L20 50A30 30 0 0 1 80 50Z\" fill=\"#005bbf\" style=\"animation-play-state: running; animation-delay: 0s;\">    <animateTransform attributeName=\"transform\" type=\"rotate\" repeatCount=\"indefinite\" dur=\"1s\" values=\"0 50 50;-45 50 50;0 50 50\" keyTimes=\"0;0.5;1\" style=\"animation-play-state: running; animation-delay: 0s;\"></animateTransform>  </path></g>  <!-- [ldio] generated by https://loading.io/ --></svg></div>");
    const replDiv = $("<div id=\"replDiv\" class=\"replDiv\"><input type=\"text\" placeholder=\"REPL: alert('Happy Hacking!')\" ></input></div>");
    const requestsBox = $("<div id=\"requestsBox\" draggable = \"true\" class=\"requestsBox animate__animated animate__rollIn customCollapse\">");
    // const responsesBox = $("<div class=\"responsesBox\">");
    const containerSvg = $("<div id=\"svgContainer\" class=\"svgContainer\">");
    const containerErrors = $("<div id=\"containerErrors\" class=\"containerErrors animate__animated\">");
    const hrefButton = $("<a class=\"btn btn-primary\" style=\"background-image: none !important;\" role=\"button\">href</a>");
    const refreshButton = $("<a class=\"btn btn-primary\" style=\"background-image: none !important;\" onclick=\"window.location.reload(true)\" role=\"button\">refresh</a>");
    const closeButton = $("<a class=\"btn btn-danger\" style=\"background-image: none !important;\" role=\"button\">X</a>");
    const buttonsDiv = $("<div class=\"buttonsDiv\"></div>");
    refreshButton.prependTo(buttonsDiv);
    hrefButton.prependTo(buttonsDiv);
    closeButton.prependTo(buttonsDiv);

    spinner.prependTo(containerSvg);
    replDiv.on("click", repl);
    replDiv.appendTo(containerSvg);
    buttonsDiv.appendTo(containerSvg);
    containerSvg.prependTo(requestsBox);
    requestsBox.appendTo($("body"));
    containerErrors.appendTo($("body"));

    //Make element Draggable W.I.P
    requestsBox[0].ondragstart = (event) => {
      event.dataTransfer.setData("text", event.target.id);
    };
    const body = $("body");
    if (body) {
      body.ondrop = (event) => {
        event.preventDefault();
        let data = event.dataTransfer.getData("text");
        event.target.appendChild(document.getElementById(data));
      };
      body.ondragover = (event) => {
        event.preventDefault();
      };
    }

    //Handcraft 'out' animation for requestsBox(This is not easy to modify)
    function closeContainerErrorsWithAnimations(closeButtons = false, collapseSpinner = false) {
      $(containerErrors).addClass("animate__hinge");
      if (closeButtons) {
        $(buttonsDiv).css("height", "500px");
        $(buttonsDiv).addClass("animate__hinge");
      }
      setTimeout(() => {
        $(containerErrors).removeClass("animate__hinge");
        $(buttonsDiv).removeClass("animate__hinge");
        $(buttonsDiv).css("height", "");
      }, 2000);
      setTimeout(() => {
        if (closeButtons) {
          $(requestsBox).addClass("customCollapse");
          $(".replDiv").css("display", "none");
        }
        $(".containerErrors div").fadeOut("2000");
        if (collapseSpinner) {
          $(buttonsDiv).css("display", "none");
          $(containerErrors).css("display", "none");
        }
      }, 1000);
    }

    //Spinner Click handler
    spinner.on("click", function() {
      //Handcraft 'in' animation for requestsBox
      if ($(requestsBox).hasClass("customCollapse")) {
        $(containerErrors).css("display", "block");
        $(requestsBox).removeClass("customCollapse");
        $(".containerErrors div").fadeIn("2000");
        $(".replDiv").css("display", "block");
        $(requestsBox).css("left", "0%");
        $(buttonsDiv).css("display", "block");
        $(containerErrors).css("display", "block");
      } else {
        closeContainerErrorsWithAnimations(true, true);
      }
    });
    // Add close button animation
    closeButton.on("click", () => {
      closeContainerErrorsWithAnimations();
    });
    // Add HREF button functionality
    hrefButton.on("click", function() {

      // const buttons = $("button");
      // buttons.map((index, button) => {
      // if($(button).data("events").click){
      //   $(button).css("background", "red");
      //   $(button).css("border-color", "yellow");
      //   $(button).css("border", "2px");
      // }
      // });
      try {
        const anchors = $("a[href^=\"/\"], a[href*=\"" + window.location.host + "\"]")
          .not(".svgContainer a")
          .not(".containerErrors a")
          .not("a[href=\"#\"]");
        const corsAnchors = $("a[href^=\"http\"]")
          .not("a[href*=\"" + window.location.host + "\"]")
          .not("a[href^=\"/\"]")
          .not(".svgContainer a")
          .not(".containerErrors a")
          .not("a[href=\"#\"]");
        // d3.selectAll(anchors).style("background-color", function() {
        //   return "hsl(" + Math.random() * 360 + ",100%,50%)";
        // });
        if (corsAnchors) {
          corsAnchors.map((index, corsAnchor) => {
            d3.select(corsAnchor).transition().duration(750)
              .style("background-color", "#ffc107")
              .style("border", "5px")
              .style("border-color", "#ffc107");
          });
        } else {
          console.warn("No CORS anchors found");
        }
        if (anchors) {
          anchors.map(async (index, anchor) => {
            try {
              await axios.get(anchor.href,{
                maxRedirects: 0,
                validateStatus: null})
              d3.select(anchor).transition().duration(500)
                .style("background-color", "green")
                .style("border", "5px")
                .style("border-color", "green");
            } catch (error) {
              d3.select(anchor).transition()
                .style("background-color", "red")
                .style("border", "5px")
                .style("border-color", "red");
            }
          });
        } else {
          console.warn("No anchors found");
        }
        // d3.select("body").transition()
        //   .style("background-color", "black");
        // d3.selectAll(anchors).transition()
        //   .duration(750)
        //   .delay(function(d, i) {
        //     return i * 10;
        //   })
        //   .attr("r", function(d) {
        //     return Math.sqrt(d * 1);
        //   });
      } catch (e) {
        console.error(e);
      }
      // $(anchors).css("background", "red").css("border-color", "yellow").css("border", "2px");
    });

    //Hijack error
    console.error = function() {
      renderEventInHTML(arguments[0], "danger");
      // default &  console.error()
      console.defaultError.apply(console, arguments);
      // new & array data
      console.errors.push(Array.from(arguments));
    };
    //Hijack warn
    console.warn = function() {
      renderEventInHTML(arguments[0], "warning");
      // default &  console.error()
      console.defaultWarn.apply(console, arguments);
      // new & array data
      console.warns.push(Array.from(arguments));
    };
    //Hijack info
    console.info = function() {
      renderEventInHTML(arguments[0], "primary");
      // default &  console.error()
      console.defaultInfo.apply(console, arguments);
      // new & array data
      console.infos.push(Array.from(arguments));
    };

    //Handler for window unhandledrejection, rejectionhandled, error
    function logEvent(errorEvent, type) {
      let error = undefined;
      try {
        if (errorEvent.reason) {
          error = errorEvent.reason.stack || errorEvent.reason.message;
        } else {
          error = errorEvent.error || errorEvent.message || JSON.stringify(errorEvent);
        }
      } catch (e) {
        console.log(e);
      }
      console.error(`window.${type}: ${error}`);
    }

    // this is only to distinguish http errors by status, cannot be used to distinguish every single event we might get
    function sendToConsole(stats) {
      stats.forEach((stat) => {
        if (stat.statusCode >= 200 && stat.statusCode < 400) {
          console.info(stat);
        } else if (stat.statusCode === 404) {
          console.warn(stat);
        } else {
          console.error(stat);
        }
      });
    }

    //TODO, We need to return promises here to be able to syncronize the event ids
    //Add custom Event listener to window, XMLHttpRequest
    function addCustomEventListeners() {
      let timer = null;
      if (window) {
        let _onerror = function(event, url, lineNo, columnNo, error) {
          let message = [];
          let eventMessage = event.message ? event.message.toLowerCase() : event.error ? event.error : null;
          if (!eventMessage && event.path[0].tagName === "IMG") {//This is hacky, change me
            eventMessage = event.type + " at <a href=\"#\" style=\"word-break: break-word;\">" + new Option(event.path[0].outerHTML).innerHTML + "<a\>";
          }
          if (!eventMessage) {
            eventMessage = event.target.id || event.target.src;
          }
          let substring = "script error";
          if (eventMessage.indexOf(substring) > -1) {
            alert("Script Error: See Browser Console for Detail");
          } else {
            message = [
              masterId,
              " Message: " + eventMessage,
              "URL: " + url,
              "Line: " + lineNo,
              "Column: " + columnNo,
              "Error object: " + JSON.stringify(error)
            ].join(" - ");
            console.error(message);
          }
          return false;
        };
        window.onerror = function() {
          let args = Array.prototype.slice.call(arguments);
          if (_onerror) {
            return _onerror.apply(window, args);
          }
          return false;
        };
        $.error = function(message) {
          console.error("jQuery: " + message);
        };
        window.onscroll = function(event) {
          event.preventDefault();
          event.stopPropagation();
          if (!scrolling) {
            scrolling = true;
            masterId++;
          }
          if (timer !== null) {
            clearTimeout(timer);
          }
          timer = setTimeout(function() {
            scrolling = false;
          }, 1000);

          // if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
          //   // you're at the bottom of the page
          // }
        };
        window.addEventListener("unhandledrejection", function(errorEvent) {
          logEvent(errorEvent, "unhandledrejection");
        });
        window.addEventListener("rejectionhandled", function(errorEvent) {
          logEvent(errorEvent, "rejectionhandled");
        });
        window.addEventListener("error", function(errorEvent) {
          logEvent(errorEvent, "error");
        });
        XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
          this._url = url;
          this._method = method;
          open.call(this, method, url, async, user, pass);
        };
        XMLHttpRequest.prototype.send = function(data) {
          let self = this;
          let start;
          let oldOnReadyStateChange;
          let url = this._url;
          let method = this._method;

          function onReadyStateChange(event) {
            //Info: Log all you need from event
            if (self.readyState === 4 /* complete */) {
              let time = new Date() - start;
              stats.push({
                url: url,
                id: masterId,
                duration: time + "ms",
                statusCode: ["undefined", "null", "", null, undefined].includes(event.currentTarget.status) ? "unknown" : event.currentTarget.status,
                response: ["undefined", "null", "", null, undefined].includes(event.currentTarget.response) ? "unknown" : event.currentTarget.response,
                method: event.currentTarget["nr@context"] && event.currentTarget["nr@context"].params ? event.currentTarget["nr@context"].params.method : method
              });
              sendToConsole(stats);
              timeoutId = null;
              stats = [];
            }
            if (oldOnReadyStateChange) {
              oldOnReadyStateChange();
            }
          }

          if (!this.noIntercept) {
            start = new Date();
            if (this.addEventListener) {
              this.addEventListener("readystatechange", onReadyStateChange, false);
            } else {
              oldOnReadyStateChange = this.onreadystatechange;
              this.onreadystatechange = onReadyStateChange;
            }
          }
          send.call(this, data);
        };
      }
      // let source = rxjs.Node.fromEvent(XMLHttpRequest.prototype.send, 'send');
    }

    //Window Load Event Handler
    window.addEventListener("load", () => {
      addCustomEventListeners();
    });

    //Count number of elements
    // let paragraphCount = document.evaluate("count(//p)", document, null, XPathResult.ANY_TYPE, null);
    // console.info("This document contains " + paragraphCount.numberValue + " paragraph elements");

    //Get Xpath and XY Coordinates of any clicked element
    document.onclick = (event) => {
      // event.stopImmediatePropagation();
      if (event === undefined) event = window.event;                     // IE hack
      let target = "target" in event ? event.target : event.srcElement; // another IE hack
      let root = document.compatMode === "CSS1Compat" ? document.documentElement : document.body;
      let mxy = [event.clientX + root.scrollLeft, event.clientY + root.scrollTop];
      let path = getPathTo(target);
      if (path.includes("requestsBox") || path.includes("svgContainer") || path.includes("containerErrors") || path.includes("requestId-") || path.includes("replDiv")) return;//We don't want to acknowledge the click we do in our own terminal
      // event.preventDefault();
      masterId++;
      let txy = getPageXY(target);
      console.info(masterId + " - " + path + " <br/>offset x:" + (mxy[0] - txy[0]) + ", y:" + (mxy[1] - txy[1]));
      addCustomEventListeners();
      getDataFromWindow();
    };

    function getPathTo(element) {
      if (element.id !== "")
        return "id(\"" + element.id + "\")";
      if (element === document.body)
        return element.tagName;
      let ix = 0;
      if (!element.parentNode) {
        return element.tagName;
      }
      let siblings = element.parentNode.childNodes;
      for (let i = 0; i < siblings.length; i++) {
        let sibling = siblings[i];
        if (sibling === element)
          return getPathTo(element.parentNode) + "/" + element.tagName + "[" + (ix + 1) + "]";
        if (sibling.nodeType === 1 && sibling.tagName === element.tagName)
          ix++;
      }
    }

    function getPageXY(element) {
      let x = 0, y = 0;
      while (element) {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
      }
      return [x, y];
    }

    // Check if canonical link URI is matching window.location.href
    function checkCanonicalLink(id) {
      if (isIframe) {// We don't want to check this if we are in an Iframe to avoid false positive
        canonicalLinkURI = $("link[rel='canonical']");
        if (canonicalLinkURI[0] && canonicalLinkURI[0].href) {
          canonicalLinkURI = new URL(canonicalLinkURI[0].href);
          windowURI = new URL(window.location.href);
          const message = `${id} - Canonical: ${canonicalLinkURI}`;
          (canonicalLinkURI.pathname === windowURI.pathname) ?
            console.info(message) : console.error(message);
        } else {
          console.warn("No canonical link found");
        }
      }
    }

    checkCanonicalLink(masterId);

    // Evaluate the ENV variables
    function getEnvsFromWindow(id) {
      const env = window.eval("window.ENV");
      if (env) {
        console.info({ id: id, "ENV": env });
      }
    }

    // Evaluate the GTM DataLayer
    function getDataFromWindow() {
      const dataLayer = unsafeWindow.dataLayer;//This the best and simpler way to do it, eval gives random behaviour and code is non-debuggeable
      if (dataLayer) {
        let sameObject = false;
        if (dataLayer.length > 0) {
          sameObject = JSON.stringify(dataLayer[dataLayer.length - 1]) === JSON.stringify(cache[cache.length - 1]);
        }
        if ((!sameObject && dataLayer) || firstRun || dataLayer.length >= cache.length) {//If it's the first time render the dataLayer, after that, only render if you detect changes in dataLayer
          firstRun = false;
          cache.push(dataLayer[dataLayer.length - 1]);
          // console.info({ "GTM": dataLayer });
          //Observe GTM dataLayer
          const gtmObserver = rxjs.of(dataLayer);
          gtmObserver
            .subscribe(changedDataLayerEntry => {
                if (changedDataLayerEntry) {
                  console.info({ id: masterId, GTM: changedDataLayerEntry });
                } else {
                  console.warn("Subscribe null received");
                }
              },
              err => {
                console.error(err);
              },
              () => {
                console.info("GTM done");
              });
        }
      }
    }

    //Access window.dataLayer without skipping the Tamper Monkey Sandbox(secure method)
    setTimeout(() => {
      getDataFromWindow(masterId);
    }, 2000);
    getEnvsFromWindow(masterId);
    // try {
    //   unsafeWindow.onYouTubeIframeAPIReady = function() {
    //     alert("API loaded");
    //   };
    // } catch (e) {
    //   console.error({response: "unsafeWindowNotFound"})
    // }
    //Only way to access window.dataLayer is by creating a script in the DOM as seeing in https://programming.mediatagtw.com/article/tampermonkey+unsafewindow AND use // @grant        unsafeWindow
    // let script = document.createElement("script");
    // script.textContent = "(" + observeDataLayer.toString() + ")();";
    // try {
    //   document.head.appendChild(script);
    // } catch (e) {// This is for: Refused to execute inline script because it violates the following Content Security Policy directive: "script-src 'unsafe-eval' 'self' 'sha256-nnRzvGsB15enSSxWufoVP+C4WOA6Spq28ybk2OobhJo=' https://static.observablehq.com https://www.google-analytics.com https://www.googleapis.com https://apis.google.com https://js.stripe.com". Either the 'unsafe-inline' keyword, a hash ('sha256-NW48ymmYcooO0dbY1vr0sH+pipddsZUK7g5L8N3COw8='), or a nonce ('nonce-...') is required to enable inline execution.
    //   console.error(e);
    // }
    //REPL
    async function repl() {
      // let result = "input javascript code";
      // const expression = prompt(result);
      const command = $(".replDiv input").val();
      let result = await eval(command);
      if (result) {
        console.info({ response: result });
      }
      await sleep(0);
    }

    function xmlHttpRequestPromise(url, option) {
      return new Promise(resolve => {
        const newOption = { url, onload, ...option };
        if (!newOption.method) newOption.method = "GET";
        GM.xmlHttpRequest(newOption);

        function onload(response) {
          resolve(response);
        }
      });
    }

    function sleep(second) {
      return new Promise(wake => setTimeout(wake, second * 1000));
    }

    repl();

    //Get Event Url
    function getEventUrl(event) {
      try {
        return new URL(event.url || event.config.url);
      } catch (e) {//Sometimes event.url will not have `origin` attribute
        return event.url || undefined;
      }
    }

    // Get Json Tree Element from Event
    function getEventJsonTreeElement(type, event) {
      let jsonTreeElement, parsedResponse;
      try {
        if (type === GTM || type === ENV) {
          jsonTreeElement = renderjson(event[type]);
        } else {
          if (event.response) {
            parsedResponse = JSON.parse(event.response);
            jsonTreeElement = renderjson(parsedResponse);
          }
        }
      } catch (e) {
        // console.log(e); //Sometimes we get malformed JSON
        try {
          parsedResponse = JSON.parse(JSON.stringify({ response: event.response }));
          jsonTreeElement = renderjson(parsedResponse);
        } catch (e) {
          console.log(e);
        }
      }
      return jsonTreeElement;
    }

    // Add Json tree to alert message line
    function addJsonTreeToRequestLine(url, event, requestLine, type, jsonTreeElement) {
      if (url) {
        url = event.url ? event.url.replace(url.origin, "") : url.href;
        requestLine.append("<p class=\"objectMessageP\">" + event.id + " - " + (event.method ? event.method.toUpperCase() : "") + " " + event.statusCode + " " + event.duration + "<br/>" + "<a href=\"" + url + "\">" + url.substring(1, url.length) + "<a/><p\>"); // adding the error response to the message
      } else {
        if (type === GTM || type === ENV) {
          if (type === GTM && cache.length === 0) {
            cache.push(event.GTM[event.GTM.length - 1]);
          }
          requestLine.append("<p class=\"objectMessageP\">" + event.id + " - " + type + ":<p\>"); // adding the GTM info response to the message
        } else {
          requestLine.append("<p class=\"objectMessageP\">" + event.id + " - " + event[0] + "<p\>"); // adding the error response to the message
        }
      }
      if (jsonTreeElement) {
        requestLine.append(jsonTreeElement);
      }
      if (type === GTM) {
        requestLine.attr("data-object", JSON.stringify(event[type]));
        // alertLine.data("gtm-object", JSON.stringify(event[type]));
      }
    }

    //This method needs complex logic since every event needs to be rendered differently in the DOM(event, error, info, env_variable, GTM object), TODO NEEDS REFACTOR
    function appendObjectToRequestLine(event, requestLine, type = "event") {
      let url, jsonTreeElement;
      url = getEventUrl(event);
      jsonTreeElement = getEventJsonTreeElement(type, event);
      addJsonTreeToRequestLine(url, event, requestLine, type, jsonTreeElement);
    }

    //Render events into HTML
    function renderEventInHTML(event, alertType) {
      alertType = bubbleStates.includes(alertType) ? alertType : "primary";
      const newId = id++;
      const requestLine = $("<div id=\"requestId-" + newId + "\" class=\"alert alert-dismissible fade show\" style=\"display: none;\">");
      // const responseLine = $("<div id=\"responseId-" + newId + "\" style=\"display: block;\">");
      requestLine.addClass("alert-" + alertType);
      const close = $("<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">&times</button>");
      requestLine.append(close);
      if (typeof event === "string") {
        requestLine.append(event);
      } else {
        if (event.GTM || event.ENV) {
          appendObjectToRequestLine(event, requestLine, event.ENV ? ENV : GTM);
        } else {
          appendObjectToRequestLine(event, requestLine);
        }
      }
      requestLine.prependTo(containerErrors).fadeIn(300); //.delay(20000).fadeOut(500); //.delay(5000).fadeOut(500);
    }
  }
)();

